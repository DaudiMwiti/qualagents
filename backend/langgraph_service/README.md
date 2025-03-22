
# LangGraph Analysis Service

This is a FastAPI backend service that uses LangGraph and LangChain with Hugging Face Transformers to analyze data using various methodological approaches.

## Setup

### Prerequisites
- Python 3.9+
- 2-4GB RAM (for running flan-t5-large model)
- CPU-only deployment is sufficient

### Local Development

1. Clone the repository
2. Navigate to the `backend/langgraph_service` directory
3. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```
6. Optionally, change the model in the `.env` file:
   ```
   LOCAL_LLM_MODEL=google/flan-t5-large
   ```
7. Run the server:
   ```
   uvicorn app:app --reload
   ```

The API will be available at `http://localhost:8000`

### Using Docker

1. Build the Docker image:
   ```
   docker build -t langgraph-service .
   ```
2. Run the container:
   ```
   docker run -p 8000:8000 langgraph-service
   ```

## Deployment Options

### Render.com (Recommended)
1. Push your code to GitHub
2. In Render.com, create a new Web Service and select your repository
3. Render will automatically detect the `render.yaml` file and configure the service
4. Alternatively, you can set up manually with these settings:
   - Build Command: `pip install -r backend/langgraph_service/requirements.txt`
   - Start Command: `cd backend/langgraph_service && uvicorn app:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `LOCAL_LLM_MODEL`: `google/flan-t5-large`
     - `PORT`: `8000`
     - `CORS_ORIGINS`: Your frontend URL

### Fly.io
1. Install the Fly CLI
2. Navigate to the `backend/langgraph_service` directory
3. Run `fly launch`
4. Set secrets: `fly secrets set LOCAL_LLM_MODEL=google/flan-t5-large CORS_ORIGINS=https://your-frontend-url.com`
5. Deploy: `fly deploy`

### Hugging Face Spaces
1. Create a new Space with the Gradio SDK
2. Upload your code
3. Add a `requirements.txt` file and a `app.py` file
4. Set the environment variables in the Space settings

## API Endpoints

### POST /run-analysis
Runs analysis on a project using specified agent methodologies.

Request body:
```json
{
  "project_id": "string",
  "user_id": "string",
  "agent_ids": ["string"]
}
```

Response:
```json
{
  "batch_id": "string",
  "insights": [
    {
      "id": "string",
      "text": "string",
      "relevance": 0,
      "methodology": "string",
      "agentId": "string",
      "agentName": "string"
    }
  ],
  "summary": "string"
}
```

## Integration with Frontend

To use this service with the React frontend:

1. Ensure the service is running (either locally or deployed)
2. Set the `USE_LANGGRAPH_BACKEND` environment variable to `true` in your frontend environment
3. Set the `LANGGRAPH_API_URL` to your deployed backend URL
4. Make sure your frontend's `vite.config.ts` file includes:
   ```typescript
   define: {
     'process.env.USE_LANGGRAPH_BACKEND': JSON.stringify(process.env.USE_LANGGRAPH_BACKEND),
     'process.env.LANGGRAPH_API_URL': JSON.stringify(process.env.LANGGRAPH_API_URL)
   }
   ```
5. The frontend will automatically connect to this service instead of using the simulated responses

## Available Agent Types

- `grounded-theory` - Grounded Theory Agent
- `feminist-theory` - Feminist Theory Agent
- `bias-identification` - Bias Identification Agent
- `critical-analysis` - Critical Analysis Agent
- `phenomenological` - Phenomenological Agent

## Model Configuration

By default, this service uses the google/flan-t5-large model from Hugging Face, which requires less resources than larger models.

Some recommended models:
- `google/flan-t5-large` (default, good balance of performance and resource usage)
- `google/flan-t5-base` (smaller, faster, less resource intensive)
- `facebook/bart-large-cnn` (good for summarization tasks)
- `distilgpt2` (very small model for simple text generation)

For more powerful models (requires more resources):
- `mistralai/Mistral-7B-Instruct-v0.1` (requires 8GB+ RAM)
- `TheBloke/Llama-2-7B-Chat-GGUF` (requires GGUF support)

## Troubleshooting

If you encounter Out of Memory (OOM) errors:
1. Try a smaller model like `google/flan-t5-base` or `distilgpt2`
2. Reduce batch size and max_new_tokens in the pipeline configuration
3. Consider deploying on a machine with more RAM
