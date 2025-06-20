import { NextRequest, NextResponse } from "next/server";
import { FeedbackService } from "./feedback.service";

export const FeedbackController = {
  async list() {
    try {
      const feedbacks = await FeedbackService.list();


      return NextResponse.json(feedbacks);
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
      return NextResponse.json(
        { error: "Erro ao buscar feedbacks" },
        { status: 500 }
      );
    }
  },

  async create(req: NextRequest) {
    try {
      const body = await req.json();

      const feedback = await FeedbackService.create({
        prompt: body,
        response: body.response,
        feedbackId: body.feedbackId ?? undefined,
        rating: body.rating ?? undefined,
        comment: body.comment ?? undefined,
        status: "pendente", // sempre cria como pendente
      });
      return NextResponse.json(feedback, { status: 201 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Erro ao criar feedback" },
        { status: 500 }
      );
    }
  },

  async update(req: NextRequest) {
    try {
      const body = await req.json();
      const { id, ...data } = body;
      const feedback = await FeedbackService.update(id, data);
      return NextResponse.json(feedback);
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Erro ao atualizar feedback" },
        { status: 500 }
      );
    }
  },

  async remove(req: NextRequest) {
    try {
      const body = await req.json();
      await FeedbackService.remove(body.id);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Erro ao remover feedback" },
        { status: 500 }
      );
    }
  },
};
