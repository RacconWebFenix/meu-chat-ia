export interface FeedbackCreateInput {
  prompt: string;
  response: string;
  feedbackId?: string | null;
  rating?: number | null;
  comment?: string | null;
  status: string;
}

export interface FeedbackUpdateInput {
  rating?: number | null;
  comment?: string | null;
  isPositive?: boolean | null;
  feedbackId?: string | null;
  status: string;
}
