import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AgentInteraction {
  id: string;
  agentId: string;
  timestamp: string;
  content: string;
  type: 'input' | 'output' | 'insight';
  metadata?: Record<string, any>;
  isCompressed?: boolean;
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
    const { agentId, interactions } = await req.json();
    
    if (!agentId) {
      return new Response(
        JSON.stringify({ error: 'Agent ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get agent interactions if not provided
    let agentInteractions = interactions;
    if (!agentInteractions) {
      const { data, error } = await supabase
        .from('agent_interactions')
        .select('*')
        .eq('agentId', agentId)
        .order('timestamp', { ascending: false })
        .limit(30);
      
      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to get agent interactions' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      agentInteractions = data;
    }
    
    if (!agentInteractions || agentInteractions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No interactions to summarize', summary: '' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Prepare the interaction history for summarization
    const interactionText = agentInteractions
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(interaction => 
        `[${interaction.type.toUpperCase()}] ${new Date(interaction.timestamp).toLocaleString()}: ${interaction.content}`
      )
      .join('\n\n');
    
    // Call OpenAI to generate a summary
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: "system", 
            content: "You are an AI assistant that creates concise summaries of agent interaction history. Your goal is to compress the historical context while preserving key information and insights. Focus on the most important elements that would be needed for future analysis." 
          },
          { 
            role: "user", 
            content: `Summarize the following agent interaction history, capturing the essential context, questions, findings, and insights. Keep the summary under 500 words:\n\n${interactionText}` 
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }
    
    const result = await response.json();
    const summary = result.choices[0].message.content;
    
    // Store the summary in the agent record
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        contextSummary: summary,
        updatedAt: new Date().toISOString()
      })
      .eq('id', agentId);
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update agent with summary' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Mark older interactions as compressed (except insights and recent ones)
    // Keep last 24 hours of interactions plus all insights
    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - 1);
    
    const recentAndInsights = agentInteractions
      .filter(i => i.type === 'insight' || new Date(i.timestamp) >= cutoffTime)
      .map(i => i.id);
    
    if (recentAndInsights.length > 0) {
      const { error: compressError } = await supabase
        .from('agent_interactions')
        .update({ isCompressed: true })
        .eq('agentId', agentId)
        .not('id', 'in', `(${recentAndInsights.join(',')})`);
      
      if (compressError) {
        console.error('Error marking interactions as compressed:', compressError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        agentId,
        summary,
        compressedCount: agentInteractions.length - recentAndInsights.length
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
