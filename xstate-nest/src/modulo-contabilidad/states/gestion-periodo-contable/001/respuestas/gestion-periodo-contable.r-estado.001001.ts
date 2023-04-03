import { EventObject } from 'xstate/lib/types';
import { UsuarioEntity } from '../../../../usuario/usuario.entity';

export type GestionPeriodoContableREstado001001 = EventObject & {
  data: TGestionPeriodoContableREstado001001;
};
export type TGestionPeriodoContableREstado001001 = {
  usuarios: UsuarioEntity[];
};
