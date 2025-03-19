
import { useState, useEffect, useRef } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Send, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  agentId?: string;
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  projectId: string;
  activeAgents: string[];
}

const AgentChat = ({ projectId, activeAgents }: AgentChatProps) => {
  const supabase = useSupabaseClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Subscribe to messages channel
  useEffect(() => {
    const channel = supabase
      .channel(`project-chat-${projectId}`)
      .on('broadcast', { event: 'new-message' }, (payload) => {
        setMessages((prev) => [...prev, payload.payload as Message]);
      })
      .subscribe();
      
    // Get initial messages
    const getInitialMessages = async () => {
      const { data, error } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        setMessages(
          data.map((msg) => ({
            id: msg.id,
            sender: msg.sender_type,
            agentId: msg.agent_id,
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }))
        );
      }
    };
    
    getInitialMessages();
    
    return () => {
      channel.unsubscribe();
    };
  }, [projectId, supabase]);
  
  // For demo purposes, generate mock initial messages
  useEffect(() => {
    // Only add mock messages if no real messages exist
    if (messages.length === 0) {
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: 'agent',
          agentId: 'system',
          content: 'Welcome to the QualAgents project chat. How can I assist with your qualitative research today?',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
        },
      ];
      setMessages(mockMessages);
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date(),
    };
    
    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    
    // In a real implementation, save the message to Supabase
    // For demo purposes, we'll just simulate agent responses
    setIsTyping(true);
    
    // Simulate agent response after a short delay
    setTimeout(() => {
      if (activeAgents.length > 0) {
        // Pick a random agent to respond
        const randomAgentIndex = Math.floor(Math.random() * activeAgents.length);
        const respondingAgentId = activeAgents[randomAgentIndex];
        
        const agentMessage: Message = {
          id: crypto.randomUUID(),
          sender: 'agent',
          agentId: respondingAgentId,
          content: generateAgentResponse(respondingAgentId, newMessage),
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, agentMessage]);
        setIsTyping(false);
      } else {
        // System response if no agents are active
        const systemMessage: Message = {
          id: crypto.randomUUID(),
          sender: 'agent',
          agentId: 'system',
          content: 'No agents are currently active. Please activate agents in the settings to enable agent responses.',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, systemMessage]);
        setIsTyping(false);
      }
    }, 1500);
  };
  
  const getAgentName = (agentId: string | undefined): string => {
    if (!agentId || agentId === 'system') return 'System';
    
    const allAgents = [
      ...methodologies, ...theoreticalFrameworks, ...validationAgents
    ];
    
    const agent = allAgents.find(a => a.value === agentId);
    return agent ? agent.label : agentId;
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg">Agent Collaboration Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.sender === 'agent' && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {message.sender === 'agent' && (
                      <div className="text-xs text-muted-foreground mb-1">
                        {getAgentName(message.agentId)}
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Agent is typing...
                    </div>
                    <div className="rounded-lg px-3 py-2 text-sm bg-muted">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75"></div>
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isTyping}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isTyping || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

// Data for generating responses
const methodologies = [
  { value: "grounded-theory", label: "Grounded Theory Agent" },
  { value: "phenomenology", label: "Phenomenology Agent" },
  { value: "discourse-analysis", label: "Discourse Analysis Agent" },
  { value: "narrative-analysis", label: "Narrative Analysis Agent" },
];

const theoreticalFrameworks = [
  { value: "feminist-theory", label: "Feminist Theory Agent" },
  { value: "critical-race-theory", label: "Critical Race Theory Agent" },
  { value: "post-colonialism", label: "Post-Colonial Theory Agent" },
  { value: "structuralism", label: "Structuralism Agent" },
];

const validationAgents = [
  { value: "bias-identification", label: "Bias Identification Agent" },
  { value: "assumption-validation", label: "Assumption Validation Agent" },
  { value: "triangulation", label: "Triangulation Agent" },
  { value: "member-checking", label: "Member Checking Agent" },
];

// Helper function to generate agent responses
function generateAgentResponse(agentId: string, userMessage: string): string {
  const responses: Record<string, string[]> = {
    'grounded-theory': [
      "Based on the patterns in your data, I'm identifying several emerging categories that could form the basis of a theory.",
      "I notice saturation has been reached in the 'trust' category after analyzing 15 interviews.",
      "Your open coding revealed 24 initial concepts, which I've grouped into 5 axial categories.",
      "The core category emerging from your data appears to be 'navigating uncertainty'.",
    ],
    'phenomenology': [
      "Examining the lived experience of your participants reveals shared structures of meaning around technology use.",
      "I've bracketed potential biases in your interpretation to focus on the essence of the participant experience.",
      "The phenomenological reduction suggests three essential themes in how participants experience this phenomenon.",
      "Your participants' descriptions point to embodied experiences that transcend demographic differences.",
    ],
    'discourse-analysis': [
      "The language patterns in your interview transcripts reveal power dynamics between users and technology.",
      "I've identified recurring metaphors of 'journey' and 'battle' when participants describe their experiences.",
      "The discursive construction of 'expertise' varies significantly across demographic groups in your sample.",
      "Your data shows interesting linguistic patterns in how participants position themselves in relation to technology.",
    ],
    'narrative-analysis': [
      "The stories your participants tell follow common narrative arcs of challenge, adaptation, and mastery.",
      "I've identified three distinct narrative typologies across your interview data.",
      "The temporal organization of participant stories reveals shifting perspectives over time.",
      "Your participants' narratives construct technology as both antagonist and ally in their personal stories.",
    ],
    'feminist-theory': [
      "Your data reveals gendered patterns in how participants navigate technological spaces.",
      "I'm seeing evidence of how technological design reinforces certain power structures.",
      "The intersection of gender with other identities appears significant in how participants engage with the system.",
      "Your findings could benefit from considering how care work is distributed in technological contexts.",
    ],
    'critical-race-theory': [
      "Analysis reveals racial disparities in how participants experience and access the technology.",
      "I'm examining how the design choices may inadvertently perpetuate systemic inequalities.",
      "Your data shows interesting patterns in how different racial groups perceive algorithmic decision-making.",
      "Counter-narratives in your minority participant interviews challenge dominant assumptions about technology use.",
    ],
    'bias-identification': [
      "I've detected potential confirmation bias in how you've interpreted participant responses in section 3.",
      "Your sampling method may have introduced selection bias favoring tech-savvy participants.",
      "There's some evidence of anchoring bias in how you've framed questions about user satisfaction.",
      "I recommend reviewing for potential in-group bias in how you've categorized participant experiences.",
    ],
    'assumption-validation': [
      "Your assumption that age correlates with technology comfort isn't fully supported by the data.",
      "I've validated your core assumption about privacy concerns across all demographic groups.",
      "The data challenges your initial assumption about user motivations for using this feature.",
      "Your framework relies on an unexamined assumption about user goals that requires validation.",
    ],
    'triangulation': [
      "Comparing qualitative interviews with usage data confirms your findings about feature adoption.",
      "I've triangulated findings across methods and found consistency in privacy concern themes.",
      "Cross-referencing survey and interview data reveals some discrepancies in reported behaviors.",
      "Methodological triangulation strengthens your conclusions about user preferences.",
    ],
    'member-checking': [
      "Participant feedback confirms your interpretation of their experiences with the system.",
      "Two participants disagreed with your characterization of their attitudes toward data sharing.",
      "Member checking strengthened your analysis by clarifying ambiguous statements in interviews.",
      "Sharing preliminary findings with participants yielded valuable insights for refining your theory.",
    ],
  };
  
  // Default to system responses if agent type not found
  const agentResponses = responses[agentId] || [
    "I'm analyzing your message based on qualitative research methodologies.",
    "I've processed your input and have some insights to share.",
    "Based on my analysis framework, here are some observations about your message.",
    "Your query has been processed according to established research protocols.",
  ];
  
  // Return a random response from the appropriate list
  const randomIndex = Math.floor(Math.random() * agentResponses.length);
  return agentResponses[randomIndex];
}

export default AgentChat;
