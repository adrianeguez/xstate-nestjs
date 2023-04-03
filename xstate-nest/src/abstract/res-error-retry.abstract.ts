import { EventObject } from 'xstate/lib/types';
import { IResErrorAbstract } from './res-error.abstract';

export type ResErrorRetryAbstract = EventObject & {
  data: IResErrorAbstractRetry;
};

export interface IResErrorAbstractRetry extends IResErrorAbstract {
  numeroRetries: number;
}
