export interface ContextoAbstract<T = any> {
  delay: number;
  numeroRetries: number;
  error?: number;
  mensajeError?: string;
  respuestaEstado?: T;
}
