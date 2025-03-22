import { toast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { runLangGraphAnalysis } from "../api/runLangGraph";

export interface AnalysisRequest {
  projectId: string;
  agentIds: string[];
  documentIds?: string[];
}

export interface AnalysisStatus {
  id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface AgentResult {
  id: string;
  text: string;
  confidence: number;
  documentId?: string;
  chunkId?: string;
  metadata?: Record<string, any>;
}

export interface AnalysisResult {
  batchId: string;
  projectId: string;
  insights: any[];
  agentResults: Record<string, AgentResult[]>;
  status: 'completed' | 'failed';
  completedAt: Date;
  documentStats?: {
    totalProcessed: number;
    totalChunks: number;
    averageChunkLength: number;
  };
}

// Mock implementation for demo purposes
class AnalysisService {
  // Track analyses that have shown completion toasts to prevent duplicates
  private completedToasts: Set<string> = new Set();

  async startAnalysis(request: AnalysisRequest): Promise<string> {
    console.log("Starting analysis for project:", request.projectId);
    console.log("Selected agents:", request.agentIds);
    
    // Check if we should use the LangGraph backend
    const useLangGraph = process.env.USE_LANGGRAPH_BACKEND === 'true';
    
    if (useLangGraph) {
      try {
        // Generate a temporary user ID for demo purposes
        const userId = `user-${Math.random().toString(36).substring(2, 15)}`;
        
        // Call the LangGraph backend
        const result = await runLangGraphAnalysis({
          projectId: request.projectId,
          userId,
          agentIds: request.agentIds
        });
        
        // Store the result in localStorage for retrieval
        this.storeAnalysisResult(result.batchId, request, result);
        
        return result.batchId;
      } catch (error) {
        console.error("Error with LangGraph analysis:", error);
        // Fall back to the mock implementation
        console.log("Falling back to mock implementation...");
      }
    }
    
    // For demo purposes, we'll generate a random batch ID
    const batchId = `batch-${Math.random().toString(36).substring(2, 15)}`;
    
    // Simulate storing the analysis request
    localStorage.setItem(`analysis_${batchId}`, JSON.stringify({
      ...request,
      status: 'queued',
      createdAt: new Date().toISOString(),
      documentsQueued: this.getProjectDocuments(request.projectId).length
    }));
    
    // Start the analysis process asynchronously
    this.processAnalysisBatch(batchId, request);
    
    return batchId;
  }
  
  private storeAnalysisResult(batchId: string, request: AnalysisRequest, result: any): void {
    // Transform the LangGraph result into the expected format
    const analysisData = {
      ...request,
      status: 'completed',
      startedAt: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
      completedAt: new Date().toISOString(),
      progress: 100,
      results: {
        agentResults: this.transformToAgentResults(result.insights, request.agentIds),
        insights: result.insights,
        documentStats: {
          totalProcessed: 3, // Mock value
          totalChunks: 9,    // Mock value
          averageChunkLength: 1000 // Mock value
        },
        summary: result.summary
      }
    };
    
    localStorage.setItem(`analysis_${batchId}`, JSON.stringify(analysisData));
  }
  
  private transformToAgentResults(insights: any[], agentIds: string[]): Record<string, AgentResult[]> {
    const results: Record<string, AgentResult[]> = {};
    
    // Initialize results for each agent
    agentIds.forEach(agentId => {
      results[agentId] = [];
    });
    
    // Group insights by agent
    insights.forEach(insight => {
      if (insight.agentId && results[insight.agentId]) {
        results[insight.agentId].push({
          id: insight.id,
          text: insight.text,
          confidence: insight.relevance / 100,
          metadata: {
            relevanceScore: insight.relevance / 100,
            methodology: insight.methodology
          }
        });
      }
    });
    
    return results;
  }
  
  private async processAnalysisBatch(batchId: string, request: AnalysisRequest): Promise<void> {
    console.log(`Processing analysis batch ${batchId}`);
    
    try {
      // Get the stored analysis data
      const storedData = localStorage.getItem(`analysis_${batchId}`);
      if (!storedData) {
        throw new Error("Analysis batch not found");
      }
      
      const analysisData = JSON.parse(storedData);
      
      // Update status to processing
      analysisData.status = 'processing';
      analysisData.startedAt = new Date().toISOString();
      localStorage.setItem(`analysis_${batchId}`, JSON.stringify(analysisData));
      
      // Get project documents
      const documents = this.getProjectDocuments(request.projectId);
      if (documents.length === 0) {
        throw new Error("No documents found for analysis");
      }
      
      // Chunk documents
      const chunks = await this.chunkDocuments(documents);
      console.log(`Created ${chunks.length} chunks from ${documents.length} documents`);
      
      // Process chunks with agents
      const results: Record<string, AgentResult[]> = {};
      let processedChunks = 0;
      
      // Initialize results structure for each agent
      request.agentIds.forEach(agentId => {
        results[agentId] = [];
      });
      
      // Simulate processing chunks with agents
      for (const chunk of chunks) {
        for (const agentId of request.agentIds) {
          // Simulate agent processing time (100-300ms per chunk per agent)
          await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
          
          // Generate mock results for this agent and chunk
          const agentResults = this.generateMockAgentResults(agentId, chunk);
          results[agentId].push(...agentResults);
        }
        
        processedChunks++;
        
        // Update progress
        analysisData.progress = Math.floor((processedChunks / chunks.length) * 100);
        localStorage.setItem(`analysis_${batchId}`, JSON.stringify(analysisData));
      }
      
      // Generate insights from agent results
      const insights = this.generateInsightsFromResults(results);
      
      // Update analysis with results
      analysisData.status = 'completed';
      analysisData.completedAt = new Date().toISOString();
      analysisData.progress = 100;
      analysisData.results = {
        agentResults: results,
        insights: insights,
        documentStats: {
          totalProcessed: documents.length,
          totalChunks: chunks.length,
          averageChunkLength: chunks.reduce((sum, chunk) => sum + chunk.text.length, 0) / chunks.length
        }
      };
      
      localStorage.setItem(`analysis_${batchId}`, JSON.stringify(analysisData));
      
      // Only show completion toast if we haven't shown it for this batch yet
      if (!this.completedToasts.has(batchId)) {
        this.completedToasts.add(batchId);
        
        // Notify completion via toast (if the user is still on the page)
        toast({
          title: "Analysis Complete!",
          description: `Analysis of ${documents.length} documents with ${request.agentIds.length} agents is complete.`,
          duration: 5000,
        });
      }
      
    } catch (error) {
      console.error("Error processing analysis batch:", error);
      
      // Update batch with error
      const storedData = localStorage.getItem(`analysis_${batchId}`);
      if (storedData) {
        const analysisData = JSON.parse(storedData);
        analysisData.status = 'failed';
        analysisData.error = error instanceof Error ? error.message : "Unknown error";
        localStorage.setItem(`analysis_${batchId}`, JSON.stringify(analysisData));
      }
      
      // Notify error via toast
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred during analysis",
        duration: 5000,
      });
    }
  }
  
  private getProjectDocuments(projectId: string): Array<{ id: string; name: string; content: string; metadata?: any }> {
    // In a real implementation, this would fetch from the database
    // For demo purposes, we'll generate mock documents
    const mockDocumentCount = 5;
    const mockDocuments = [];
    
    for (let i = 1; i <= mockDocumentCount; i++) {
      mockDocuments.push({
        id: `doc-${i}`,
        name: `Document ${i}.txt`,
        content: this.generateMockDocumentContent(),
        metadata: {
          uploadedAt: new Date(Date.now() - i * 86400000).toISOString(),
          size: Math.floor(Math.random() * 1000000) + 50000,
          type: "text/plain"
        }
      });
    }
    
    return mockDocuments;
  }
  
  private async chunkDocuments(documents: Array<{ id: string; name: string; content: string; metadata?: any }>): Promise<Array<{ id: string; documentId: string; text: string; index: number }>> {
    const chunks: Array<{ id: string; documentId: string; text: string; index: number }> = [];
    const chunkSize = 1000; // Characters per chunk
    const overlap = 200; // Overlap between chunks
    
    for (const doc of documents) {
      const content = doc.content;
      let index = 0;
      
      // Simple chunking by character count with overlap
      for (let i = 0; i < content.length; i += chunkSize - overlap) {
        const chunkText = content.substring(i, i + chunkSize);
        
        chunks.push({
          id: `chunk-${doc.id}-${index}`,
          documentId: doc.id,
          text: chunkText,
          index: index
        });
        
        index++;
      }
    }
    
    return chunks;
  }
  
  private generateMockDocumentContent(): string {
    const paragraphCount = Math.floor(Math.random() * 10) + 5;
    let content = "";
    
    const topics = [
      "user experience issues with the application interface",
      "accessibility concerns noted by participants",
      "gender differences in technology adoption",
      "cultural biases in the research methodology",
      "ethical considerations in data collection",
      "participant feedback on new features",
      "observations about participant engagement",
      "recommendations for future research",
      "limitations of the current approach",
      "unexpected findings from the data"
    ];
    
    for (let i = 0; i < paragraphCount; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const sentenceCount = Math.floor(Math.random() * 5) + 3;
      let paragraph = "";
      
      for (let j = 0; j < sentenceCount; j++) {
        paragraph += `This is a sentence about ${topic} with some relevant details and observations. `;
      }
      
      content += paragraph + "\n\n";
    }
    
    return content;
  }
  
  private generateMockAgentResults(agentId: string, chunk: { id: string; documentId: string; text: string; index: number }): AgentResult[] {
    // Generate 0-3 insights per chunk per agent
    const resultCount = Math.floor(Math.random() * 3);
    const results: AgentResult[] = [];
    
    const agentInsightTemplates: Record<string, string[]> = {
      'grounded-theory': [
        "Participants frequently mentioned {issue} as a key concern.",
        "The data reveals a pattern of {pattern} among users.",
        "There's a clear relationship between {conceptA} and {conceptB}.",
        "Users consistently reported difficulties with {feature}."
      ],
      'feminist-theory': [
        "Gender disparities were evident in how {topic} was experienced.",
        "Power dynamics influenced participants' perceptions of {issue}.",
        "Women and non-binary participants reported different experiences with {feature}.",
        "There's evidence of structural bias in how {process} is designed."
      ],
      'bias-identification': [
        "Language used in {context} reveals underlying assumptions about {topic}.",
        "The framing of {issue} contains potential biases toward {group}.",
        "Exclusionary patterns were identified in how {feature} was described.",
        "Methodology choices may have introduced bias in {aspect} of the findings."
      ]
    };
    
    const topics = [
      "navigation", "accessibility", "user interface", "documentation", 
      "onboarding process", "technical language", "support features",
      "feedback mechanisms", "error messages", "learning curve"
    ];
    
    const templates = agentInsightTemplates[agentId] || agentInsightTemplates['grounded-theory'];
    
    for (let i = 0; i < resultCount; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      // Simple template substitution
      let text = template
        .replace('{issue}', topic)
        .replace('{feature}', topic)
        .replace('{topic}', topic)
        .replace('{process}', topic)
        .replace('{aspect}', topic)
        .replace('{context}', "the interface")
        .replace('{group}', "certain user groups")
        .replace('{pattern}', "repeated struggles with " + topic)
        .replace('{conceptA}', "user experience")
        .replace('{conceptB}', "task completion rates");
      
      results.push({
        id: `result-${agentId}-${chunk.id}-${i}`,
        text: text,
        confidence: 0.5 + Math.random() * 0.5, // Random confidence between 0.5 and 1.0
        documentId: chunk.documentId,
        chunkId: chunk.id,
        metadata: {
          relevanceScore: 0.5 + Math.random() * 0.5,
          methodology: agentId
        }
      });
    }
    
    return results;
  }
  
  private generateInsightsFromResults(results: Record<string, AgentResult[]>): any[] {
    const insights: any[] = [];
    const agentNames: Record<string, string> = {
      'grounded-theory': 'Grounded Theory Agent',
      'feminist-theory': 'Feminist Theory Agent',
      'bias-identification': 'Bias Identification Agent'
    };
    
    // Generate top insights from agent results
    Object.entries(results).forEach(([agentId, agentResults]) => {
      // Sort by confidence
      const sortedResults = [...agentResults].sort((a, b) => b.confidence - a.confidence);
      
      // Take top 2-3 results as insights
      const topCount = Math.min(sortedResults.length, 2 + Math.floor(Math.random() * 2));
      for (let i = 0; i < topCount; i++) {
        const result = sortedResults[i];
        if (result) {
          insights.push({
            id: `insight-${agentId}-${i}`,
            text: result.text,
            agentId: agentId,
            agentName: agentNames[agentId] || agentId,
            relevance: Math.round(result.confidence * 100),
            methodology: agentId.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            documentId: result.documentId,
            chunkId: result.chunkId
          });
        }
      }
    });
    
    return insights;
  }
  
  async getAnalysisStatus(batchId: string): Promise<AnalysisStatus> {
    // In a real implementation, this would query the database
    // to get the current status of the analysis
    
    const stored = localStorage.getItem(`analysis_${batchId}`);
    if (!stored) {
      throw new Error("Analysis not found");
    }
    
    const analysis = JSON.parse(stored);
    
    return {
      id: batchId,
      projectId: analysis.projectId,
      status: analysis.status,
      progress: analysis.progress || 0,
      startedAt: analysis.startedAt ? new Date(analysis.startedAt) : undefined,
      completedAt: analysis.completedAt ? new Date(analysis.completedAt) : undefined,
      error: analysis.error
    };
  }
  
  async getAnalysisResults(batchId: string): Promise<AnalysisResult | null> {
    // In a real implementation, this would query the database
    // to get the results of the analysis
    
    const stored = localStorage.getItem(`analysis_${batchId}`);
    if (!stored) {
      return null;
    }
    
    const analysis = JSON.parse(stored);
    
    // If the analysis is complete, return the results
    if (analysis.status === 'completed' && analysis.results) {
      return {
        batchId,
        projectId: analysis.projectId,
        insights: analysis.results.insights,
        agentResults: analysis.results.agentResults,
        status: 'completed' as const,
        completedAt: new Date(analysis.completedAt),
        documentStats: analysis.results.documentStats
      };
    }
    
    // For demo purposes, we'll simulate results if not completed yet
    return {
      batchId,
      projectId: analysis.projectId,
      insights: [
        {
          id: 'insight-1',
          text: 'Participants frequently mentioned difficulties with the user interface, particularly with navigation and finding specific features.',
          relevance: 95,
          methodology: 'Grounded Theory',
          agentId: 'grounded-theory',
          agentName: 'Grounded Theory Agent'
        },
        {
          id: 'insight-2',
          text: 'There is a notable gender disparity in how users perceive the difficulty of technical tasks, with female participants reporting higher frustration levels.',
          relevance: 87,
          methodology: 'Feminist Theory',
          agentId: 'feminist-theory',
          agentName: 'Feminist Theory Agent'
        },
        {
          id: 'insight-3',
          text: 'The language used in the documentation contains technical jargon that may alienate users without technical backgrounds.',
          relevance: 82,
          methodology: 'Critical Analysis',
          agentId: 'bias-identification',
          agentName: 'Bias Identification Agent'
        }
      ],
      agentResults: {
        'grounded-theory': [
          {
            id: 'gt-1',
            text: 'Participants frequently mentioned difficulties with the user interface.',
            confidence: 0.95
          },
          {
            id: 'gt-2',
            text: 'Users expressed a desire for more contextual help features.',
            confidence: 0.88
          }
        ],
        'feminist-theory': [
          {
            id: 'ft-1',
            text: 'There is a gender disparity in how users perceive the difficulty of technical tasks.',
            confidence: 0.87
          }
        ],
        'bias-identification': [
          {
            id: 'bi-1',
            text: 'The language used in the documentation contains technical jargon.',
            confidence: 0.82
          }
        ]
      },
      status: 'completed' as const,
      completedAt: new Date()
    };
  }
  
  // For a real Supabase implementation:
  async startAnalysisWithSupabase(request: AnalysisRequest, supabase: any): Promise<string> {
    try {
      // Create a batch record
      const { data: batch, error: batchError } = await supabase
        .from('agent_batches')
        .insert({
          projectId: request.projectId,
          agentIds: request.agentIds,
          status: 'queued'
        })
        .select()
        .single();
        
      if (batchError) {
        throw batchError;
      }
      
      // Call the Supabase Edge Function to start processing
      const { error: fnError } = await supabase.functions.invoke('process-agent-batch', {
        body: { batchId: batch.id }
      });
      
      if (fnError) {
        throw fnError;
      }
      
      return batch.id;
    } catch (error) {
      console.error("Error starting analysis:", error);
      throw error;
    }
  }
}

export const analysisService = new AnalysisService();
