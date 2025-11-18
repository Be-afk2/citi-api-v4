export interface JWTPayload {
  id: string;
  nombre: string;
  tipo: number;
  iat?: number;
  exp?: number;
}
