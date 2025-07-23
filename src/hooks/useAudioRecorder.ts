// src/hooks/useAudioRecorder.ts
import { useState, useRef, useCallback } from "react";
import { N8nFinalResponse } from "@/types";

// A tipagem do callback (a função que o pai nos envia)
type OnTranscriptionComplete = (result: N8nFinalResponse[] | null) => void;

// O hook agora aceita um onComplete opcional
export const useAudioRecorder = (onComplete?: OnTranscriptionComplete) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setIsRecording(true);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        setIsSending(true);

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok)
            throw new Error("Falha na resposta da API de áudio.");

          const rawResult = await response.json();

          // Garante que o resultado seja sempre um array
          let resultArray: N8nFinalResponse[] = [];
          if (Array.isArray(rawResult)) {
            resultArray = rawResult;
          } else if (rawResult && typeof rawResult === "object") {
            resultArray = [rawResult];
          }
       

          if (typeof onComplete === "function") {
            onComplete(resultArray);
          }
        } catch (error) {
          console.error("Erro ao enviar áudio:", error);
          if (typeof onComplete === "function") {
            onComplete(null);
          }
        } finally {
          setIsSending(false);
        }
      };

      recorder.start();
    } catch (err) {
      console.error("Erro ao acessar o microfone:", err);
    }
  }, [onComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return { isRecording, isSending, startRecording, stopRecording };
};
