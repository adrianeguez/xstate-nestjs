export interface RespuestaEstado<T = any> {
  codigoError?: number;
  data?: T;
  mensaje: string;
  error?: number;
}
