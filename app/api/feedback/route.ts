import { FeedbackController } from "./feedback.controller";

export const GET = FeedbackController.list;
export const POST = FeedbackController.create;
export const PUT = FeedbackController.update;
export const DELETE = FeedbackController.remove;
