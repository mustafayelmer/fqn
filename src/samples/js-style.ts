import {fqn} from "../FqnImpl";

export const js1Fnc1 = (): void => {return}
export function js1Fnc2(): void {return;}
export class Js1Class1 {
    static static1 (): void {return;}
    instance1 (): void {return;}
}
export const ins2 = new Js1Class1();
export const ins3 = new js1Fnc2();
fqn.patch(this, 'js');