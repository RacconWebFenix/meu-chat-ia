export interface FeedbackCreateInput {
  prompt: string;
  response: string;
  feedbackId?: string | null;
  rating?: number | null;
  comment?: string | null;
  status: string;
}

export type FeedbackUpdateInput = {
  rating?: number;
  comment?: string;
  isPositive?: boolean;
  feedbackId?: string;
  status?: string; // <-- adicione esta linha
};
