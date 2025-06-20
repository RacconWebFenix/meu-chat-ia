import { prisma } from "@/prisma/lib/prisma";
import { FeedbackCreateInput, FeedbackUpdateInput } from "./feedback.types";

export const FeedbackService = {
  
  list: () => prisma.feedback.findMany(),
  create: (data: FeedbackCreateInput) => prisma.feedback.create({ data }),

  update: (id: string, data: FeedbackUpdateInput) =>
    prisma.feedback.update({
      where: { id },
      data: {
        ...data,
      },
    }),
  remove: (id: string) => prisma.feedback.delete({ where: { id } }),
};
