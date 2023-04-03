import { EventObject } from 'xstate/lib/types';
import { UsuarioEntity } from '../../../../usuario/usuario.entity';

export type GestionPeriodoContableRFlujo001001 = EventObject & {
  data: TGestionPeriodoContableRFlujo001001;
};
export type TGestionPeriodoContableRFlujo001001 = {
  usuarios: UsuarioEntity[];
};
