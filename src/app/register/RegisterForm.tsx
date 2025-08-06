"use client";
import { useState } from "react";
import { Typography } from "@mui/material";
import { CustomButton, CustomInput, ChatLoading } from "@/components/shared";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { navigateTo } = useNavigationWithLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          name: name.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.error || "Erro ao cadastrar");
      } else {
        setSuccess("Usuário cadastrado com sucesso!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigateTo("/login");
        }, 1500);
      }
    } catch (registerError) {
      console.error("Register error:", registerError);
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
            name="register_user"
            autoCorrect="off"
            spellCheck={false}
            margin="normal"
            fullWidth
            required
          />
          <CustomInput
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            name="register_name"
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
            name="register_pass"
            autoCorrect="off"
            spellCheck={false}
            margin="normal"
            fullWidth
            required
          />
          {error && (
            <Typography color="error" textAlign="center" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography
              color="primary"
              textAlign="center"
              sx={{ mt: 1, mb: 1 }}
            >
              {success}
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
            }}
            disabled={loading}
          >
            Cadastrar
          </CustomButton>
          <CustomButton
            type="button"
            colorType="secondary"
            fullWidth
            variant="outlined"
            sx={{
              mt: 1,
              py: 1.5,
            }}
            onClick={() => navigateTo("/login")}
          >
            Voltar para login
          </CustomButton>
        </>
      )}
    </form>
  );
};

export default RegisterForm;
