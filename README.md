
# QualAgents - AI-Powered Qualitative Research Platform


## Overview

QualAgents is an advanced platform leveraging AI-powered agents for qualitative research analysis. The platform enables researchers, UX professionals, and data analysts to extract meaningful insights from qualitative data through multiple methodological approaches.

## Core Features

- **Multi-Agent Analysis**: Deploy specialized AI agents using different methodological frameworks
- **Diverse Methodological Approaches**: Including Grounded Theory, Feminist Theory, Critical Analysis, Bias Identification, and Phenomenological approaches
- **Interactive Insights Dashboard**: Visualize findings through comprehensive charts and data visualization tools
- **Collaborative Workspace**: Share projects and insights with team members
- **Data Upload & Management**: Process various data formats including text, CSV, and more
- **Export & Reporting**: Generate comprehensive reports of your analysis findings

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components with Tailwind CSS
- **State Management**: React Query for server state, React Context for local state
- **Routing**: React Router
- **Data Visualization**: Recharts
- **Authentication**: Supabase Auth

### Backend
The backend is implemented as a separate repository: [qualagents-langgraph-backend](https://github.com/your-username/qualagents-langgraph-backend)

- **Framework**: FastAPI
- **AI/ML**: LangChain, LangGraph
- **Models**: Hugging Face Transformers (flan-t5-large by default)
- **Deployment**: Render.com

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/qualagents.git
   cd qualagents
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:8080`

### Connecting to the Backend

The frontend is configured to connect to the LangGraph backend service. To enable this:

1. Set the following environment variables in your Vite configuration:
   ```
   USE_LANGGRAPH_BACKEND=true
   LANGGRAPH_API_URL=http://localhost:8000  # For local development
   ```

2. For production, update the `LANGGRAPH_API_URL` to point to your deployed backend.

## Backend Setup

The backend is maintained in a separate repository for better separation of concerns and deployment flexibility.

1. Clone the backend repository:
   ```bash
   git clone https://github.com/your-username/qualagents-langgraph-backend.git
   cd qualagents-langgraph-backend
   ```

2. Refer to the backend repository's README for detailed setup instructions.

## Deployment

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your preferred hosting service (Netlify, Vercel, etc.)

3. Ensure that the environment variables are properly set for your production environment.

### Backend Deployment

The backend can be deployed on Render.com using the provided `render.yaml` configuration file. See the backend repository for detailed deployment instructions.

## System Architecture

### Agent Methodologies

QualAgents features multiple AI agents, each implementing a different methodological approach:

1. **Grounded Theory Agent**: Identifies patterns and themes directly from data
2. **Feminist Theory Agent**: Analyzes power dynamics and gender considerations
3. **Bias Identification Agent**: Recognizes potential biases in data collection or interpretation
4. **Critical Analysis Agent**: Applies critical theory to identify underlying assumptions
5. **Phenomenological Agent**: Focuses on lived experiences and subjective perceptions

### Data Flow

1. User uploads qualitative data (text, interviews, survey responses)
2. Data is preprocessed and formatted for analysis
3. Multiple agents analyze the data through different methodological lenses
4. Results are aggregated, ranked by relevance, and presented as insights
5. Users can interact with insights, provide feedback, and export findings

## Customization

QualAgents allows for extensive customization of:

- Agent parameters and behaviors
- Analysis settings
- Visualization preferences
- Export formats
- Collaboration settings

## Integration with Supabase

This project uses Supabase for:

- User authentication and management
- Data storage
- Edge functions for processing complex operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the LangChain and LangGraph communities
- Hugging Face for providing transformer models
- The shadcn/ui team for their excellent component library
