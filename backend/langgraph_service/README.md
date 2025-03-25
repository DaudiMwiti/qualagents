
# QualAgents LangGraph Backend Service

![QualAgents Backend](https://img.shields.io/badge/QualAgents-Backend-blue)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.0+-green)
![LangGraph](https://img.shields.io/badge/LangGraph-0.0.15+-orange)

## Overview

This repository contains the backend service for the QualAgents platform, an AI-powered qualitative research analysis tool. The service uses LangGraph and LangChain with Hugging Face Transformers to analyze qualitative data through multiple methodological approaches.

## Features

- **Multi-Agent Analysis Pipeline**: Orchestrates multiple AI agents with different methodological frameworks
- **Methodological Diversity**: Implements Grounded Theory, Feminist Theory, Critical Analysis, Bias Identification, and Phenomenological approaches
- **Efficient Processing**: Optimized for handling qualitative data with minimal resource requirements
- **REST API**: Clean API for integration with the QualAgents frontend
- **Supabase Integration**: Connect to Supabase for data persistence and authentication

## System Requirements

- Python 3.9+
- 2-4GB RAM (for running flan-t5-large model)
- CPU-only deployment is sufficient for most use cases

## Setup

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/qualagents-langgraph-backend.git
   cd qualagents-langgraph-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

5. Configure your `.env` file with appropriate values:
   ```
   # Model Configuration
   LOCAL_LLM_MODEL=google/flan-t5-large

   # Server Configuration
   PORT=8000

   # CORS settings (in production, restrict to your frontend URL)
   CORS_ORIGINS=http://localhost:8080,https://your-frontend-url.com

   # Supabase Integration
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

6. Run the server:
   ```bash
   uvicorn app:app --reload
   ```

The API will be available at `http://localhost:8000` with API documentation at `/docs`.

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t qualagents-langgraph-service .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env qualagents-langgraph-service
   ```

## Deployment Options

### Render.com (Recommended)

This repository includes a `render.yaml` file for easy deployment on Render.com:

1. Create a new Render.com Web Service
2. Connect your GitHub repository
3. Render will automatically detect the configuration
4. Set your environment variables in the Render dashboard
5. Deploy

### Alternative Deployment Options

#### Fly.io
```bash
fly launch
fly secrets set LOCAL_LLM_MODEL=google/flan-t5-large CORS_ORIGINS=https://your-frontend-url.com
fly deploy
```

#### Hugging Face Spaces
Create a new Space with the Gradio SDK and upload your code.

## API Documentation

### POST /run-analysis
Runs analysis on a project using specified agent methodologies.

**Request:**
```json
{
  "project_id": "string",
  "user_id": "string",
  "agent_ids": ["string"]
}
```

**Response:**
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

## Agent Types

The service supports multiple agent types, each implementing a different methodological approach:

- `grounded-theory`: Identifies patterns and themes directly from data
- `feminist-theory`: Analyzes data with attention to gender and power dynamics
- `bias-identification`: Identifies potential biases in the data or analysis
- `critical-analysis`: Applies critical theory to uncover underlying assumptions
- `phenomenological`: Focuses on lived experiences and subjective perceptions

## Model Configuration

By default, this service uses the `google/flan-t5-large` model from Hugging Face, which provides a good balance between performance and resource usage. You can change the model in your `.env` file.

### Recommended Models:

#### For Resource-Constrained Environments:
- `google/flan-t5-base` (smaller, faster, less resource intensive)
- `facebook/bart-large-cnn` (good for summarization tasks)
- `distilgpt2` (very small model for simple text generation)

#### For Higher Performance:
- `mistralai/Mistral-7B-Instruct-v0.1` (requires 8GB+ RAM)
- `TheBloke/Llama-2-7B-Chat-GGUF` (requires GGUF support)

## Integration with Frontend

To connect the QualAgents frontend to this backend service:

1. Set the environment variables in your frontend:
   ```
   USE_LANGGRAPH_BACKEND=true
   LANGGRAPH_API_URL=https://your-backend-url.com
   ```

2. The `runLangGraphAnalysis` function in the frontend will automatically connect to this backend.

## Performance Optimization

If you encounter performance issues:

1. Try a smaller model like `google/flan-t5-base`
2. Reduce batch size and max_new_tokens in the pipeline configuration
3. Consider upgrading to a machine with more RAM for larger models
4. Use quantized models (like GGUF formats) for better performance/resource ratio

## Troubleshooting

### Common Issues:

1. **Out of Memory errors**: 
   - Try a smaller model
   - Reduce batch size
   - Increase swap space

2. **Slow response times**:
   - Use a smaller model
   - Implement caching for repeated analyses
   - Consider batching multiple requests

3. **CORS errors**:
   - Ensure your frontend URL is correctly listed in the CORS_ORIGINS variable
   - For development, include both localhost URLs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
