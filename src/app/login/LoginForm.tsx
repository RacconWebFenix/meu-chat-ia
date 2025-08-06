"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Typography } from "@mui/material";
import { CustomButton, CustomInput, ChatLoading } from "@/components/shared";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const { navigateTo } = useNavigationWithLoading();

  const handleNavigateToRegister = () => navigateTo("/register");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
        callbackUrl: "/",
      });
      if (res && res.error) {
        setLoading(false);
        setError("Usuário ou senha inválidos");
      } else if (res && res.ok) {
        if (onSuccess) onSuccess();
        else navigateTo("/");
      } else {
        setLoading(false);
        setError("Erro inesperado no login");
      }
    } catch (loginError) {
      console.error("Login error:", loginError);
      setLoading(false);
      setError("Erro interno. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {loading ? (
        <ChatLoading />
      ) : (
        <>
          <CustomInput
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // autoFocus removido
            autoComplete="off"
            name="login_user"
            autoCorrect="off"
            spellCheck={false}
            margin="normal"
            fullWidth
          />
          <CustomInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            name="login_pass"
            autoCorrect="off"
            spellCheck={false}
            margin="normal"
            fullWidth
          />
          {error && (
            <Typography color="error" textAlign="center" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <CustomButton
            type="submit"
            colorType="primary"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: 16,
              fontWeight: 700,
            }}
            disabled={loading}
          >
            Entrar
          </CustomButton>
          <Typography textAlign="center" sx={{ mt: 2 }}>
            Não é cadastrado?{" "}
            <span
              role="link"
              tabIndex={0}
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={handleNavigateToRegister}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                handleNavigateToRegister()
              }
            >
              Faça seu cadastro
            </span>
          </Typography>
        </>
      )}
    </form>
  );
};

export default LoginForm;
