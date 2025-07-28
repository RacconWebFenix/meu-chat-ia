// src/hooks/useAudioRecorder.ts
import { useState, useRef, useCallback } from "react";

// O callback agora recebe apenas a string da transcrição ou nulo
type OnTranscriptionComplete = (transcription: string | null) => void;

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
          // Chama a nova rota que SÓ transcreve
          const response = await fetch("/api/just-transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Falha na resposta da API de transcrição.");
          }

          const result = await response.json();
          console.log(
            "[Hook useAudioRecorder] Resposta recebida da API:",
            JSON.stringify(result, null, 2)
          );
          // Espera-se que o N8N retorne { transcription: "..." }
          const transcriptionText = result?.transcription || null;

          if (typeof onComplete === "function") {
            onComplete(transcriptionText);
          }
        } catch (error) {
          console.error("Erro ao enviar áudio para transcrição:", error);
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
