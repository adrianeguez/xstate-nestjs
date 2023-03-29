import {EventObject} from "xstate/lib/types";

export type ResGpcA003Done = EventObject & {
    data: ResGpcA003
}
export type ResGpcA003 = {
    cuentasContables: any[];
}