"use client";
import React from "react";
import CustomButton from "../CustomButton";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    // Se for um erro de hidratação, tenta recarregar a página uma vez
    if (
      error.message.includes("Hydration") ||
      error.message.includes("hydration") ||
      error.message.includes("data-emotion") ||
      error.message.includes("css-global")
    ) {
      console.warn("Hydration/CSS error detected, attempting page reload...");
      // Evita loop infinito usando sessionStorage
      if (!sessionStorage.getItem("hydration-reload-attempted")) {
        sessionStorage.setItem("hydration-reload-attempted", "true");
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      } else {
        // Se já tentou uma vez, limpa o flag e deixa o error boundary mostrar a UI
        sessionStorage.removeItem("hydration-reload-attempted");
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={() => this.setState({ hasError: false })}
          />
        );
      }

      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Algo deu errado!</h2>
          <p>Ocorreu um erro inesperado. Tente recarregar a página.</p>
          <CustomButton
            onClick={() => window.location.reload()}
            colorType="primary"
            variant="contained"
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: 16,
              fontWeight: 700,
              background: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.primary.contrastText,
              "&:hover": {
                background: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            Recarregar Página
          </CustomButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
