// noinspection JSUnusedGlobalSymbols

import {fqn} from "../FqnImpl";

export namespace ns2 {
    export class Class1 {
        static static1 (): void {return;}
        static static2 (): void {return;}
        instance1 (): void {return;}
        instance2 (): void {return;}
    }
    export namespace sub {
        export class Class2 extends Class1 {
            static static2 (): void {return;}
            static static3 (): void {return;}
            instance2 (): void {return;}
            instance3 (): void {return;}
        }

    }
    export function func1(): void {return;}
}
fqn.patchModule({ns2}, 1);