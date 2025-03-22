
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from langchain.agents import AgentExecutor
from langchain.memory import ConversationBufferMemory
from langchain.tools import tool
from langgraph.graph import StateGraph
from langchain.schema import HumanMessage, AIMessage
from transformers import pipeline, AutoConfig
from langchain.llms import HuggingFacePipeline
import logging
import json
from supabase import create_client, Client

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables for model configuration
DEFAULT_MODEL = "google/flan-t5-large"
MODEL_NAME = os.getenv("LOCAL_LLM_MODEL", DEFAULT_MODEL)
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Optional[Client] = None

# Initialize Supabase if credentials are available
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
else:
    logger.warning("Supabase credentials not found. Supabase integration is disabled.")

app = FastAPI(title="LangGraph Analysis Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class AnalysisRequest(BaseModel):
    project_id: str
    user_id: str
    agent_ids: List[str]

# Response models
class AnalysisResponse(BaseModel):
    batch_id: str
    insights: List[dict]
    summary: str

# Mock agents for demonstration
AGENT_METHODS = {
    "grounded-theory": "Grounded Theory Agent",
    "feminist-theory": "Feminist Theory Agent",
    "bias-identification": "Bias Identification Agent",
    "critical-analysis": "Critical Analysis Agent",
    "phenomenological": "Phenomenological Agent"
}

def create_llm():
    """Create LLM with fallback logic if primary model is too large"""
    try:
        # Check if model exists and get its config
        logger.info(f"Attempting to load model: {MODEL_NAME}")
        config = AutoConfig.from_pretrained(MODEL_NAME)
        
        # Check model size (rough estimate based on parameters)
        if hasattr(config, 'num_parameters') and config.num_parameters > 1_500_000_000:  # 1.5B parameters
            logger.warning(f"Model {MODEL_NAME} is large ({config.num_parameters/1_000_000_000:.1f}B parameters). Consider a smaller model for deployment.")
        
        # Create the pipeline
        hf_pipeline = pipeline(
            "text-generation",
            model=MODEL_NAME,
            max_new_tokens=256,
            do_sample=True,
            temperature=0.7
        )
        
        return HuggingFacePipeline(pipeline=hf_pipeline)
        
    except Exception as e:
        logger.error(f"Error loading model {MODEL_NAME}: {str(e)}")
        
        # Try fallback models
        fallback_models = ["google/flan-t5-base", "facebook/bart-large-cnn", "distilgpt2"]
        
        for fallback_model in fallback_models:
            try:
                logger.warning(f"Attempting to load fallback model: {fallback_model}")
                hf_pipeline = pipeline(
                    "text-generation",
                    model=fallback_model,
                    max_new_tokens=128,  # Smaller models, smaller outputs
                    do_sample=True,
                    temperature=0.7
                )
                return HuggingFacePipeline(pipeline=hf_pipeline)
            except Exception as fallback_error:
                logger.error(f"Error loading fallback model {fallback_model}: {str(fallback_error)}")
        
        # If all fallbacks fail, raise exception
        raise RuntimeError("Failed to load any language model. Check model compatibility and system resources.")

def create_agent_for_method(agent_id: str):
    """Create a specific agent based on methodology"""
    # Get LLM with fallback logic
    llm = create_llm()
    
    @tool
    def analyze_data(query: str) -> str:
        """Analyze data using the specific methodology"""
        method_name = AGENT_METHODS.get(agent_id, "Unknown Method")
        return f"Analysis from {method_name}: insights about {query}"
    
    memory = ConversationBufferMemory()
    
    # Create a simple state graph for the agent
    class AgentState:
        def __init__(self):
            self.messages = []
            self.next = None
    
    def agent_node(state):
        messages = state.messages
        input_content = messages[-1].content if messages else "No input provided"
        # Use the HuggingFacePipeline for generating responses
        response = llm.invoke(input_content)
        return {"messages": messages + [AIMessage(content=response)], "next": "output"}
    
    def output_node(state):
        return state
    
    # Build the graph
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent_node)
    workflow.add_node("output", output_node)
    workflow.set_entry_point("agent")
    workflow.add_edge("agent", "output")
    
    # Compile the graph
    graph = workflow.compile()
    
    return graph

async def fetch_project_data_from_supabase(project_id: str):
    """Fetch project data from Supabase"""
    if not supabase:
        logger.warning("Supabase not initialized, using mock data")
        return {
            "documents": [
                {"id": "doc1", "name": "Document 1", "content": "Sample content for testing"},
                {"id": "doc2", "name": "Document 2", "content": "More sample content for analysis"}
            ]
        }
    
    try:
        # Fetch project documents from Supabase
        response = await supabase.table("documents").select("*").eq("project_id", project_id).execute()
        
        if response.data:
            return {"documents": response.data}
        else:
            logger.warning(f"No documents found for project {project_id}")
            return {"documents": []}
            
    except Exception as e:
        logger.error(f"Error fetching project data: {str(e)}")
        return {"documents": []}

async def store_insights_in_supabase(batch_id: str, insights: List[dict], project_id: str):
    """Store insights in Supabase"""
    if not supabase:
        logger.warning("Supabase not initialized, skipping insight storage")
        return
    
    try:
        # Prepare insights for storage
        insight_records = []
        for insight in insights:
            insight_records.append({
                "id": insight.get("id", str(uuid.uuid4())),
                "batch_id": batch_id,
                "project_id": project_id,
                "text": insight.get("text", ""),
                "relevance": insight.get("relevance", 0),
                "methodology": insight.get("methodology", ""),
                "agent_id": insight.get("agentId", ""),
                "created_at": insight.get("created_at", None)
            })
        
        if insight_records:
            # Store in agent_insights table
            await supabase.table("agent_insights").insert(insight_records).execute()
            logger.info(f"Stored {len(insight_records)} insights in Supabase")
    except Exception as e:
        logger.error(f"Error storing insights: {str(e)}")

@app.get("/")
async def root():
    return {"message": "LangGraph Analysis Service is running", "model": MODEL_NAME, "supabase_connected": supabase is not None}

@app.post("/run-analysis", response_model=AnalysisResponse)
async def run_analysis(request: AnalysisRequest):
    try:
        # Generate a unique batch ID
        batch_id = str(uuid.uuid4())
        
        # Validate agent_ids
        valid_agents = []
        for agent_id in request.agent_ids:
            if agent_id in AGENT_METHODS:
                valid_agents.append(agent_id)
            else:
                raise HTTPException(status_code=400, detail=f"Unknown agent: {agent_id}")
        
        if not valid_agents:
            raise HTTPException(status_code=400, detail="No valid agents specified")
        
        # If Supabase is connected, fetch project data
        project_data = await fetch_project_data_from_supabase(request.project_id)
        
        # If connected to Supabase, record the analysis batch
        if supabase:
            try:
                batch_data = {
                    "id": batch_id,
                    "project_id": request.project_id,
                    "agent_ids": request.agent_ids,
                    "status": "in-progress"
                }
                await supabase.table("agent_batches").insert(batch_data).execute()
                logger.info(f"Recorded analysis batch {batch_id} in Supabase")
            except Exception as e:
                logger.error(f"Error recording batch: {str(e)}")
        
        # Process each agent (in a real system, this would be parallelized or queued)
        insights = []
        for agent_id in valid_agents:
            # Create and run the agent
            agent = create_agent_for_method(agent_id)
            
            # In a real implementation, you would process actual data
            # For demo purposes, we're generating mock insights
            agent_name = AGENT_METHODS[agent_id]
            
            # Create mock insights based on agent type
            if agent_id == "grounded-theory":
                insights.append({
                    "id": f"lg-{uuid.uuid4()}",
                    "text": "Users frequently mentioned difficulties with the navigation interface, particularly on mobile devices.",
                    "relevance": 92,
                    "methodology": "Grounded Theory",
                    "agentId": agent_id,
                    "agentName": agent_name
                })
            elif agent_id == "feminist-theory":
                insights.append({
                    "id": f"lg-{uuid.uuid4()}",
                    "text": "Significant gender disparity in reporting technical issues, with women more likely to articulate specific interface problems.",
                    "relevance": 85,
                    "methodology": "Feminist Theory",
                    "agentId": agent_id,
                    "agentName": agent_name
                })
            elif agent_id == "bias-identification":
                insights.append({
                    "id": f"lg-{uuid.uuid4()}",
                    "text": "Documentation contains technical jargon that creates barriers for non-expert users.",
                    "relevance": 78,
                    "methodology": "Critical Analysis",
                    "agentId": agent_id,
                    "agentName": agent_name
                })
            elif agent_id == "critical-analysis":
                insights.append({
                    "id": f"lg-{uuid.uuid4()}",
                    "text": "The current product narrative implies a universal user experience while ignoring cultural context variation.",
                    "relevance": 82,
                    "methodology": "Critical Analysis",
                    "agentId": agent_id,
                    "agentName": agent_name
                })
            elif agent_id == "phenomenological":
                insights.append({
                    "id": f"lg-{uuid.uuid4()}",
                    "text": "Users express feelings of frustration during onboarding, followed by confidence after completing initial tasks.",
                    "relevance": 88,
                    "methodology": "Phenomenological Analysis",
                    "agentId": agent_id,
                    "agentName": agent_name
                })
        
        # Generate a summary based on all insights
        summary = "Analysis reveals significant usability challenges with the navigation interface, particularly on mobile devices. Gender disparities exist in how technical issues are reported, with women providing more specific details about interface problems. The documentation uses technical jargon that creates barriers for non-expert users."
        
        # If Supabase is connected, store the insights
        await store_insights_in_supabase(batch_id, insights, request.project_id)
        
        # If Supabase is connected, update the batch status
        if supabase:
            try:
                await supabase.table("agent_batches").update({"status": "completed"}).eq("id", batch_id).execute()
                logger.info(f"Updated batch {batch_id} status to completed")
            except Exception as e:
                logger.error(f"Error updating batch status: {str(e)}")
        
        return AnalysisResponse(
            batch_id=batch_id,
            insights=insights,
            summary=summary
        )
        
    except Exception as e:
        logger.error(f"Error in run_analysis: {str(e)}")
        
        # If Supabase is connected, update the batch status to failed
        if supabase and 'batch_id' in locals():
            try:
                await supabase.table("agent_batches").update({
                    "status": "failed",
                    "error": str(e)
                }).eq("id", batch_id).execute()
                logger.info(f"Updated batch {batch_id} status to failed")
            except Exception as db_error:
                logger.error(f"Error updating batch status: {str(db_error)}")
                
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
