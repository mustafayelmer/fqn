import {fqn} from "../FqnImpl";

export const singleFnc1 = () : void => {return}
export function SingleFnc2(): void {return;}
export class SingleClass1 {
    static static1 (): void {return;}
    instance1 (): void {return;}
}
export const singleClass1 = new SingleClass1();
fqn.patch( {singleFnc1, SingleFnc2, SingleClass1, singleClass1});

export const singleFnc2 = new SingleFnc2();
fqn.patch({singleFnc2});
