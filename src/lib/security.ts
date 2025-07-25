import * as crypto from 'crypto';

/**
 * Validações críticas de segurança
 * Este arquivo deve ser importado na inicialização da aplicação
 */

export class SecurityValidator {
  /**
   * Valida configurações críticas de segurança
   */
  static validateCriticalConfig(): void {
    const errors: string[] = [];

    // 1. Verificar NEXTAUTH_SECRET
    if (!process.env.NEXTAUTH_SECRET) {
      errors.push(
        "❌ NEXTAUTH_SECRET é obrigatório! Configure esta variável de ambiente."
      );
    } else if (process.env.NEXTAUTH_SECRET.length < 32) {
      errors.push(
        "❌ NEXTAUTH_SECRET deve ter pelo menos 32 caracteres para ser seguro."
      );
    }

    // 2. Verificar NEXTAUTH_URL em produção
    if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL) {
      errors.push("❌ NEXTAUTH_URL é obrigatório em produção!");
    }

    // 3. Verificar DATABASE_URL
    if (!process.env.DATABASE_URL) {
      errors.push("❌ DATABASE_URL é obrigatório!");
    }

    // 4. Verificar se não está usando valores padrão perigosos
    const dangerousDefaults = [
      "secret",
      "password",
      "admin",
      "test",
      "development",
      "fallback-secret-for-development",
    ];

    if (
      process.env.NEXTAUTH_SECRET &&
      dangerousDefaults.some((dangerous) =>
        process.env.NEXTAUTH_SECRET!.toLowerCase().includes(dangerous)
      )
    ) {
      errors.push(
        "❌ NEXTAUTH_SECRET não deve conter valores padrão ou óbvios!"
      );
    }

    // Se houver erros, falhar imediatamente
    if (errors.length > 0) {
      console.error("🚨 FALHAS CRÍTICAS DE SEGURANÇA DETECTADAS:");
      errors.forEach((error) => console.error(error));
      console.error("\n💡 Para gerar um secret seguro, execute:");
      console.error("openssl rand -base64 32");
      console.error("ou");
      console.error(
        "node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
      );

      throw new Error(
        "Configuração de segurança inválida. Aplicação não pode iniciar."
      );
    }

    console.log("✅ Validações de segurança aprovadas!");
  }

  /**
   * Gera um secret seguro (para desenvolvimento)
   */
  static generateSecureSecret(): string {
    return crypto.randomBytes(32).toString("base64");
  }

  /**
   * Valida força de senha
   */
  static validatePasswordStrength(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Senha deve ter pelo menos 8 caracteres");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Senha deve conter pelo menos uma letra maiúscula");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Senha deve conter pelo menos uma letra minúscula");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Senha deve conter pelo menos um número");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Senha deve conter pelo menos um caractere especial");
    }

    // Verificar senhas comuns
    const commonPasswords = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Senha muito comum, escolha uma senha mais segura");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitiza entrada de usuário
   */
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove < e >
      .replace(/javascript:/gi, "") // Remove javascript:
      .replace(/on\w+=/gi, "") // Remove event handlers
      .substring(0, 255); // Limita tamanho
  }
}

// Executar validação na importação
SecurityValidator.validateCriticalConfig();
