
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, ThumbsDown, MessageSquare, Check } from "lucide-react";
import { feedbackService } from "@/services/feedbackService";

interface InsightFeedbackDialogProps {
  insightId?: string;
  agentId: string;
  insight: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFeedbackSaved?: () => void;
}

const InsightFeedbackDialog = ({
  insightId,
  agentId,
  insight,
  open,
  onOpenChange,
  onFeedbackSaved,
}: InsightFeedbackDialogProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!rating && !comment) {
      toast({
        title: "Feedback required",
        description: "Please provide a rating or comment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await feedbackService.saveInsightFeedback({
        insightId,
        agentId,
        insight,
        rating,
        comment
      });
      
      toast({
        title: "Feedback saved",
        description: "Your feedback has been recorded",
      });
      
      if (onFeedbackSaved) {
        onFeedbackSaved();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        title: "Error saving feedback",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setRating(null);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Insight Feedback
          </DialogTitle>
          <DialogDescription>
            Provide feedback on this insight to improve future analyses.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/50 p-3 rounded-md mb-4 text-sm">
            {insight}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Was this insight helpful?
              </label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={rating === 'positive' ? 'default' : 'outline'}
                  className={`flex-1 ${rating === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setRating(rating === 'positive' ? null : 'positive')}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Helpful
                </Button>
                <Button 
                  type="button"
                  variant={rating === 'negative' ? 'default' : 'outline'}
                  className={`flex-1 ${rating === 'negative' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setRating(rating === 'negative' ? null : 'negative')}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Not Helpful
                </Button>
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="text-sm font-medium mb-1.5 block">
                Additional Comments (Optional)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on this insight..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!rating && !comment}
          >
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || (!rating && !comment)}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Save Feedback
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsightFeedbackDialog;
