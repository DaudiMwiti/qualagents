
import { AgentPersona } from '@/types/agent';

export class DataService {
  getPersonas(): AgentPersona[] {
    // In a real implementation, this would fetch from a database
    return [
      {
        id: "critical-theorist",
        name: "Critical Theorist",
        description: "Examines power structures and societal influences in the data",
        traits: ["Critical", "Analytical", "Questioning"]
      },
      {
        id: "methodological-pragmatist",
        name: "Methodological Pragmatist",
        description: "Focuses on practical implications and actionable insights",
        traits: ["Practical", "Results-oriented", "Systematic"]
      },
      {
        id: "interpretive-phenomenologist",
        name: "Interpretive Phenomenologist",
        description: "Explores lived experiences and subjective perspectives",
        traits: ["Empathetic", "Reflective", "Detail-oriented"]
      },
      {
        id: "constructivist",
        name: "Constructivist",
        description: "Examines how meaning is constructed through social interaction",
        traits: ["Contextual", "Relational", "Process-focused"]
      },
      {
        id: "post-positivist",
        name: "Post-Positivist",
        description: "Balances objectivity with recognition of research limitations",
        traits: ["Objective", "Rigorous", "Cautious"]
      }
    ];
  }
  
  getMethodologies(): {id: string; name: string; description: string}[] {
    // In a real implementation, this would fetch from a database
    return [
      {
        id: "grounded-theory",
        name: "Grounded Theory",
        description: "Develops theory through systematic data analysis"
      },
      {
        id: "phenomenology",
        name: "Phenomenology",
        description: "Explores lived experiences and subjective perspectives"
      },
      {
        id: "discourse-analysis",
        name: "Discourse Analysis",
        description: "Examines language use and communication patterns"
      },
      {
        id: "narrative-analysis",
        name: "Narrative Analysis",
        description: "Focuses on stories and how they shape understanding"
      },
      {
        id: "case-study",
        name: "Case Study",
        description: "In-depth examination of specific instances or examples"
      },
      {
        id: "content-analysis",
        name: "Content Analysis",
        description: "Systematic classification and counting of text"
      },
      {
        id: "thematic-analysis",
        name: "Thematic Analysis",
        description: "Identifies and analyzes patterns in qualitative data"
      },
      {
        id: "ethnography",
        name: "Ethnography",
        description: "Studies cultures and social interactions"
      }
    ];
  }
}

export const dataService = new DataService();
