"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../login/login.module.scss"; // Reaproveite o CSS do login
import ChatLoading from "../components/shared/ChatLoading/ChatLoading";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro ao cadastrar");
    } else {
      setSuccess("Usuário cadastrado com sucesso!");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginBox} onSubmit={handleSubmit}>
        {loading ? (
          <ChatLoading />
        ) : (
          <>
            <Image
              src="/assets/logo-comercio-integrado.png"
              alt="Comércio Integrado"
              width={180}
              height={60}
              priority
            />
            <div className={styles.logoWrapper}></div>
            <h2 className={styles.title}>Criar nova conta</h2>
            <input
              className={styles.input}
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className={styles.error}>{error}</div>}
            {success && (
              <div style={{ color: "#0876b9", marginBottom: 8 }}>{success}</div>
            )}
            <button className={styles.button} type="submit">
              Cadastrar
            </button>
            <button
              type="button"
              className={styles.button}
              style={{ background: "#bcdff1", color: "#0a3266", marginTop: 8 }}
              onClick={() => router.push("/login")}
            >
              Voltar para login
            </button>
          </>
        )}
      </form>
    </div>
  );
}
