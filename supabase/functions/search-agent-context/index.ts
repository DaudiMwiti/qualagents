
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AgentInteraction {
  id: string;
  agentId: string;
  timestamp: string;
  content: string;
  type: 'input' | 'output' | 'insight';
  metadata?: Record<string, any>;
  embedding?: number[];
}

serve(async (req) => {
  try {
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Initialize Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { agentId, query } = await req.json();
    
    if (!agentId || !query) {
      return new Response(
        JSON.stringify({ error: 'Agent ID and query are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate embedding for the query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query
      })
    });
    
    if (!embeddingResponse.ok) {
      const error = await embeddingResponse.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }
    
    const embeddingResult = await embeddingResponse.json();
    const queryEmbedding = embeddingResult.data[0].embedding;
    
    // First, get the agent's context summary
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('contextSummary')
      .eq('id', agentId)
      .single();
    
    if (agentError) {
      console.error('Error getting agent:', agentError);
    }
    
    // Start with most recent non-compressed interactions
    const { data: recentInteractions, error: recentError } = await supabase
      .from('agent_interactions')
      .select('*')
      .eq('agentId', agentId)
      .eq('isCompressed', false)
      .order('timestamp', { ascending: false })
      .limit(10);
    
    if (recentError) {
      console.error('Error getting recent interactions:', recentError);
    }
    
    let relevantInteractions: AgentInteraction[] = recentInteractions || [];
    
    // Add context summary if available
    if (agent?.contextSummary) {
      relevantInteractions.unshift({
        id: 'context-summary',
        agentId,
        timestamp: new Date().toISOString(),
        content: agent.contextSummary,
        type: 'input',
        metadata: { isContextSummary: true }
      });
    }
    
    // Calculate relevance for each interaction
    // In a production system, this would be better handled by a vector database
    // For this example, we'll do a simple similarity calculation
    if (relevantInteractions.length > 0) {
      // Get embeddings for all interactions
      const interactionEmbeddings = await Promise.all(
        relevantInteractions.map(async (interaction) => {
          if (interaction.embedding) {
            return interaction.embedding;
          }
          
          // Generate embedding for the interaction
          const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
              model: 'text-embedding-3-small',
              input: interaction.content
            })
          });
          
          if (!response.ok) {
            return null;
          }
          
          const result = await response.json();
          return result.data[0].embedding;
        })
      );
      
      // Calculate cosine similarity for each interaction
      const interactionsWithSimilarity = relevantInteractions
        .map((interaction, i) => {
          const embedding = interactionEmbeddings[i];
          
          if (!embedding) {
            return { interaction, similarity: 0 };
          }
          
          // Cosine similarity calculation
          let dotProduct = 0;
          let queryMagnitude = 0;
          let embeddingMagnitude = 0;
          
          for (let j = 0; j < queryEmbedding.length; j++) {
            dotProduct += queryEmbedding[j] * embedding[j];
            queryMagnitude += queryEmbedding[j] * queryEmbedding[j];
            embeddingMagnitude += embedding[j] * embedding[j];
          }
          
          queryMagnitude = Math.sqrt(queryMagnitude);
          embeddingMagnitude = Math.sqrt(embeddingMagnitude);
          
          const similarity = dotProduct / (queryMagnitude * embeddingMagnitude);
          
          return { interaction, similarity };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5); // Get top 5 most relevant
      
      // Return the interactions sorted by relevance
      relevantInteractions = interactionsWithSimilarity.map((item) => item.interaction);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        relevantInteractions,
        interactionCount: relevantInteractions.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
