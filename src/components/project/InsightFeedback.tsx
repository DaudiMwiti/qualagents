
import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { agentService } from "@/services/agentService";

interface InsightFeedbackProps {
  insightId?: string;
  agentId: string;
  insight: string;
  onFeedbackSaved?: (feedback: InsightFeedbackData) => void;
}

export interface InsightFeedbackData {
  insightId?: string;
  agentId: string;
  insight: string;
  rating: 'positive' | 'negative' | null;
  comment: string;
}

const InsightFeedback = ({ insightId, agentId, insight, onFeedbackSaved }: InsightFeedbackProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFeedback = async (newRating: 'positive' | 'negative') => {
    // Toggle rating if clicking the same button again
    const updatedRating = rating === newRating ? null : newRating;
    setRating(updatedRating);
    
    try {
      await saveFeedback(updatedRating, comment);
      
      if (!comment && !isAddingComment) {
        toast({
          title: "Feedback saved",
          description: `You ${updatedRating ? 'rated this insight ' + updatedRating : 'removed your rating'}`,
        });
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        title: "Error saving feedback",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const saveFeedback = async (
    feedbackRating: 'positive' | 'negative' | null = rating,
    feedbackComment: string = comment
  ) => {
    setIsSaving(true);
    
    try {
      const feedbackData: InsightFeedbackData = {
        insightId,
        agentId,
        insight,
        rating: feedbackRating,
        comment: feedbackComment
      };
      
      // Save feedback to backend
      if (insightId) {
        await agentService.saveInsightFeedback(feedbackData);
      }
      
      // Call the callback if provided
      if (onFeedbackSaved) {
        onFeedbackSaved(feedbackData);
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommentSave = async () => {
    try {
      await saveFeedback();
      setIsAddingComment(false);
      
      toast({
        title: "Comment saved",
        description: "Your feedback has been recorded",
      });
    } catch (error) {
      console.error("Error saving comment:", error);
      toast({
        title: "Error saving comment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-2 border-t border-border/30 pt-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${rating === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}`}
            onClick={() => handleFeedback('positive')}
            disabled={isSaving}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${rating === 'negative' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''}`}
            onClick={() => handleFeedback('negative')}
            disabled={isSaving}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
        
        {!isAddingComment ? (
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-xs"
            onClick={() => setIsAddingComment(true)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Add comment
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-xs"
            onClick={() => setIsAddingComment(false)}
          >
            Cancel
          </Button>
        )}
      </div>
      
      {isAddingComment && (
        <div className="mt-2 space-y-2">
          <Textarea
            placeholder="Add your feedback or notes about this insight..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleCommentSave}
              disabled={isSaving}
              className="h-8"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="h-3.5 w-3.5 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Save Comment
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightFeedback;
