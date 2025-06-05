"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { beautifyMarkdown } from "./utils";

interface Props {
  data?: {
    text: {
      content: string;
    };
    userValue?: string | number;
  };
}

export default function SearchPriceTextAndMarkdown({ data }: Props) {
  if (!data?.text?.content) return null;

  // Embeleza o markdown antes de renderizar
  const beautifiedContent = beautifyMarkdown(data.text.content);

  return (
    <div>
      <ReactMarkdown>{beautifiedContent}</ReactMarkdown>
    </div>
  );
}
