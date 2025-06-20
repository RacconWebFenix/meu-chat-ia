"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./login.module.scss";
import ChatLoading from "../components/shared/ChatLoading/ChatLoading";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    if (res && res.error) {
      setLoading(false);
      setError("Usuário ou senha inválidos");
    } else router.push("/");
  };

  return (
    <div className={styles.loginContainer}>
      <form
        className={styles.loginBox}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {loading ? (
          <ChatLoading />
        ) : (
          <>
            <div className={styles.logoWrapper}>
              <Image
                src="/assets/logo-comercio-integrado.png"
                alt="Comércio Integrado"
                width={184}
                height={80}
                priority
              />
            </div>
            <h2 className={styles.title}>Acesse sua conta</h2>
            <input
              className={styles.input}
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="off"
              name="login_user" // nome não convencional
              autoCorrect="off"
              spellCheck={false}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password" // força o navegador a não sugerir senha salva
              name="login_pass"
              autoCorrect="off"
              spellCheck={false}
            />
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.button} type="submit">
              Entrar
            </button>
            <div className={styles.signupLink}>
              Não é cadastrado? <a href="/register">Faça seu cadastro</a>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
