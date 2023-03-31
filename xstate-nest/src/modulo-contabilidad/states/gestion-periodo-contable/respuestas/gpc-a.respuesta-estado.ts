import { EventObject } from 'xstate/lib/types';
import { UsuarioEntity } from '../../../usuario/usuario.entity';

export type ResGpcAEstado = EventObject & {
  data: ResGpcA;
};
export type ResGpcA = {
  usuarios: UsuarioEntity[];
};
