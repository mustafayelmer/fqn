import {Fqn} from "../annotations";

@Fqn()
export class GetterSetter {
    private _field1: string;
    private static _field2: string;


    get field1(): string {
        return this._field1;
    }

    set field1(value: string) {
        this._field1 = value;
    }

    static get field2(): string {
        return this._field2;
    }

    static set field2(value: string) {
        this._field2 = value;
    }
}