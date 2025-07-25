import * as jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// Interface para o payload do JWT
interface JWTPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
  jti?: string; // JWT ID para rastreamento
  iss?: string; // Issuer
  aud?: string; // Audience
}

// Blacklist de tokens revogados (em produção, usar Redis ou banco)
const tokenBlacklist = new Set<string>();

export class TokenValidator {
  private static readonly JWT_SECRET = process.env.NEXTAUTH_SECRET;
  private static readonly JWT_ISSUER = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  private static readonly JWT_AUDIENCE = 'web-app';

  /**
   * Valida um token JWT de forma robusta
   */
  static validateToken(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
    try {
      // 1. Verificar se o secret existe
      if (!this.JWT_SECRET) {
        return { valid: false, error: 'JWT_SECRET não configurado' };
      }

      // 2. Verificar se o token não está na blacklist
      if (tokenBlacklist.has(token)) {
        return { valid: false, error: 'Token revogado' };
      }

      // 3. Verificar e decodificar o token
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        issuer: this.JWT_ISSUER,
        audience: this.JWT_AUDIENCE,
        algorithms: ['HS256'], // Especificar algoritmo permitido
        clockTolerance: 30, // 30 segundos de tolerância para clock skew
      }) as JWTPayload;

      // 4. Validações adicionais
      if (!decoded.sub || !decoded.username) {
        return { valid: false, error: 'Token inválido: dados obrigatórios ausentes' };
      }

      // 5. Verificar se o token não está muito antigo (além da expiração normal)
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - decoded.iat;
      const MAX_TOKEN_AGE = 24 * 60 * 60; // 24 horas

      if (tokenAge > MAX_TOKEN_AGE) {
        return { valid: false, error: 'Token muito antigo' };
      }

      return { valid: true, payload: decoded };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { valid: false, error: 'Token expirado' };
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return { valid: false, error: 'Token inválido' };
      }
      if (error instanceof jwt.NotBeforeError) {
        return { valid: false, error: 'Token ainda não é válido' };
      }
      
      return { valid: false, error: 'Erro na validação do token' };
    }
  }

  /**
   * Extrai token do header Authorization ou cookie
   */
  static extractTokenFromRequest(req: NextRequest): string | null {
    // 1. Tentar extrair do header Authorization
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // 2. Tentar extrair do cookie (NextAuth padrão)
    const cookies = req.headers.get('cookie');
    if (cookies) {
      const tokenMatch = cookies.match(/next-auth\.session-token=([^;]+)/);
      if (tokenMatch) {
        return tokenMatch[1];
      }
    }

    return null;
  }

  /**
   * Adiciona token à blacklist (revoga token)
   */
  static revokeToken(token: string): void {
    tokenBlacklist.add(token);
    
    // Em produção, persistir no Redis ou banco de dados
    // await redis.sadd('blacklisted_tokens', token);
    
    console.log(`Token revogado: ${token.substring(0, 20)}...`);
  }

  /**
   * Limpa tokens expirados da blacklist (executar periodicamente)
   */
  static cleanupBlacklist(): void {
    // Em produção, implementar limpeza baseada em TTL do Redis
    // ou consulta ao banco para remover tokens expirados
    console.log('Limpeza de blacklist executada');
  }

  /**
   * Gera um novo JWT com configurações seguras
   */
  static generateSecureToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti' | 'iss' | 'aud'>): string {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }

    const now = Math.floor(Date.now() / 1000);
    const jwtId = `${payload.sub}-${now}-${Math.random().toString(36).substring(2)}`;

    const tokenPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + (60 * 60), // 1 hora de expiração
      jti: jwtId,
      iss: this.JWT_ISSUER,
      aud: this.JWT_AUDIENCE,
    };

    return jwt.sign(tokenPayload, this.JWT_SECRET, {
      algorithm: 'HS256',
    });
  }
}

// Utilitário para middleware
export function createSecureTokenMiddleware() {
  return (req: NextRequest) => {
    const token = TokenValidator.extractTokenFromRequest(req);
    
    if (!token) {
      return { authorized: false, error: 'Token não encontrado' };
    }

    const validation = TokenValidator.validateToken(token);
    
    return {
      authorized: validation.valid,
      payload: validation.payload,
      error: validation.error,
    };
  };
}
