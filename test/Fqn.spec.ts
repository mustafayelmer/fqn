import { strict as assert } from 'assert';
import {ns1} from "../src/samples/namespace1";
import {ns2} from "../src/samples/namespace2";
import {mdl1} from "../src/samples/module1";
import {Js1Class1, js1Fnc1, js1Fnc2} from "../src/samples/js-style";
import {SingleClass1, singleClass1, singleFnc1, SingleFnc2, singleFnc2} from "../src/samples/single";
import {fqn, Fqn} from "../src";

@Fqn('test')
class SampleClass {
    static sampleMethod() {}
}

@Fqn()
export class GetterSetter {
    private _field1: string;
    private static _field2: string;


    get field1(): string {
        throw new Error('must be throw: get field1');
    }

    set field1(value: string) {
        throw new Error('must be throw: set field1');
    }

    static get field2(): string {
        throw new Error('must be throw: get field2');
    }

    static set field2(value: string) {
        throw new Error('must be throw: set field2');
    }
    getField3() {}
    static getField4() {}
}
describe('namespace #plain', () => {
    it('ns1', () => {
        assert.equal(fqn.get(ns1), 'ns1');
    });
    it('ns1.sub', () => {
        assert.equal(fqn.get(ns1.sub), 'ns1.sub');
    });
    it('ns1.sub.Class1', () => {
        assert.equal(fqn.get(ns1.sub.Class1), 'ns1.sub.Class1');
    });
    it('ns1.sub.Class1.static1', () => {
        assert.equal(fqn.get(ns1.sub.Class1.static1), 'ns1.sub.Class1.static1');
    });
    it('ns1.sub.Class1.static2', () => {
        assert.equal(fqn.get(ns1.sub.Class1.static2), 'ns1.sub.Class1.static2');
    });
    it('ns1.sub.Class1.instance1', () => {
        const ins = new ns1.sub.Class1();
        assert.equal(fqn.get(ins), 'ns1.sub.Class1');
        assert.equal(fqn.get(ins.instance1), 'ns1.sub.Class1.instance1');
    });
    it('ns1.sub.Class1.instance2', () => {
        const ins = new ns1.sub.Class1();
        assert.equal(fqn.get(ins.instance2), 'ns1.sub.Class1.instance2');
    });


    it('ns1.sub.Class2', () => {
        assert.equal(fqn.get(ns1.sub.Class2), 'ns1.sub.Class2');
    });
    it('ns1.sub.Class2 #prototype', () => {
        assert.equal(fqn.get(ns1.sub.Class2.prototype), 'ns1.sub.Class2');
    });
    it('ns1.sub.Class2.static1 #inherited', () => {
        assert.equal(fqn.get(ns1.sub.Class2.static1), 'ns1.sub.Class1.static1');
    });
    it('ns1.sub.Class2.static2 #overridden', () => {
        assert.equal(fqn.get(ns1.sub.Class2.static2), 'ns1.sub.Class2.static2');
    });
    it('ns1.sub.Class2.static3', () => {
        assert.equal(fqn.get(ns1.sub.Class2.static3), 'ns1.sub.Class2.static3');
    });
    it('ns1.sub.Class2.instance1 #inherited', () => {
        const ins = new ns1.sub.Class2();
        assert.equal(fqn.get(ins), 'ns1.sub.Class2');
        assert.equal(fqn.get(ins.instance1), 'ns1.sub.Class1.instance1');
    });
    it('ns1.sub.Class2.instance2 #overridden', () => {
        const ins = new ns1.sub.Class2();
        assert.equal(fqn.get(ins.instance2), 'ns1.sub.Class2.instance2');
    });
    it('ns1.sub.Class2.instance3', () => {
        const ins = new ns1.sub.Class2();
        assert.equal(fqn.get(ins.instance3), 'ns1.sub.Class2.instance3');
    });
    it('ns1.sub.func1', () => {
        assert.equal(fqn.get(ns1.sub.func1), 'ns1.sub.func1');
    });
});
describe('namespace #nested', () => {
    it('ns2', () => {
        assert.equal(fqn.get(ns2), 'ns2');
    });
    it('ns2.sub', () => {
        assert.equal(fqn.get(ns2.sub), 'ns2.sub');
    });
    it('ns2.Class1', () => {
        assert.equal(fqn.get(ns2.Class1), 'ns2.Class1');
    });
    it('ns2.Class1 #prototype', () => {
        assert.equal(fqn.get(ns2.Class1.prototype), 'ns2.Class1');
    });
    it('ns2.Class1.static1', () => {
        assert.equal(fqn.get(ns2.Class1.static1), 'ns2.Class1.static1');
    });
    it('ns2.Class1.static2', () => {
        assert.equal(fqn.get(ns2.Class1.static2), 'ns2.Class1.static2');
    });
    it('ns2.Class1.instance1', () => {
        const ins = new ns2.Class1();
        assert.equal(fqn.get(ins), 'ns2.Class1');
        assert.equal(fqn.get(ins.instance1), 'ns2.Class1.instance1');
    });
    it('ns2.Class1.instance2', () => {
        const ins = new ns2.Class1();
        assert.equal(fqn.get(ins.instance2), 'ns2.Class1.instance2');
    });


    it('ns2.sub.Class2', () => {
        assert.equal(fqn.get(ns2.sub.Class2), 'ns2.sub.Class2');
    });
    it('ns2.sub.Class2 #prototype', () => {
        assert.equal(fqn.get(ns2.sub.Class2.prototype), 'ns2.sub.Class2');
    });
    it('ns2.sub.Class2.static1 #inherited', () => {
        assert.equal(fqn.get(ns2.sub.Class2.static1), 'ns2.Class1.static1');
    });
    it('ns2.sub.Class2.static2 #overridden', () => {
        assert.equal(fqn.get(ns2.sub.Class2.static2), 'ns2.sub.Class2.static2');
    });
    it('ns2.sub.Class2.static3', () => {
        assert.equal(fqn.get(ns2.sub.Class2.static3), 'ns2.sub.Class2.static3');
    });
    it('ns2.sub.Class2.instance1 #inherited', () => {
        const ins = new ns2.sub.Class2();
        assert.equal(fqn.get(ins), 'ns2.sub.Class2');
        assert.equal(fqn.get(ins.instance1), 'ns2.Class1.instance1');
    });
    it('ns2.sub.Class2.instance2 #overridden', () => {
        const ins = new ns2.sub.Class2();
        assert.equal(fqn.get(ins.instance2), 'ns2.sub.Class2.instance2');
    });
    it('ns2.sub.Class2.instance3', () => {
        const ins = new ns2.sub.Class2();
        assert.equal(fqn.get(ins.instance3), 'ns2.sub.Class2.instance3');
    });
    it('ns2.sub.func1', () => {
        assert.equal(fqn.get(ns2.func1), 'ns2.func1');
    });
});
describe('module', () => {
    it('mdl1', () => {
        assert.equal(fqn.get(mdl1), 'mdl1');
    });
    it('mdl1.Class1', () => {
        assert.equal(fqn.get(mdl1.Class1), 'mdl1.Class1');
    });
    it('mdl1.Class1 #prototype', () => {
        assert.equal(fqn.get(mdl1.Class1.prototype), 'mdl1.Class1');
    });
    it('mdl1.Class1.static1', () => {
        assert.equal(fqn.get(mdl1.Class1.static1), 'mdl1.Class1.static1');
    });
    it('mdl1.Class1.static2', () => {
        assert.equal(fqn.get(mdl1.Class1.static2), 'mdl1.Class1.static2');
    });
    it('mdl1.Class1.instance1', () => {
        const ins = new mdl1.Class1();
        assert.equal(fqn.get(ins), 'mdl1.Class1');
        assert.equal(fqn.get(ins.instance1), 'mdl1.Class1.instance1');
    });
    it('mdl1.Class1.instance2', () => {
        const ins = new mdl1.Class1();
        assert.equal(fqn.get(ins.instance2), 'mdl1.Class1.instance2');
    });


    it('mdl1.Class2', () => {
        assert.equal(fqn.get(mdl1.Class2), 'mdl1.Class2');
    });
    it('mdl1.Class2 #prototype', () => {
        assert.equal(fqn.get(mdl1.Class2.prototype), 'mdl1.Class2');
    });
    it('mdl1.Class2.static1 #inherited', () => {
        assert.equal(fqn.get(mdl1.Class2.static1), 'mdl1.Class1.static1');
    });
    it('mdl1.Class2.static2 #overridden', () => {
        assert.equal(fqn.get(mdl1.Class2.static2), 'mdl1.Class2.static2');
    });
    it('mdl1.Class2.static3', () => {
        assert.equal(fqn.get(mdl1.Class2.static3), 'mdl1.Class2.static3');
    });
    it('mdl1.Class2.instance1 #inherited', () => {
        const ins = new mdl1.Class2();
        assert.equal(fqn.get(ins), 'mdl1.Class2');
        assert.equal(fqn.get(ins.instance1), 'mdl1.Class1.instance1');
    });
    it('mdl1.Class2.instance2 #overridden', () => {
        const ins = new mdl1.Class2();
        assert.equal(fqn.get(ins.instance2), 'mdl1.Class2.instance2');
    });
    it('mdl1.Class2.instance3', () => {
        const ins = new mdl1.Class2();
        assert.equal(fqn.get(ins.instance3), 'mdl1.Class2.instance3');
    });
    it('mdl1.func1', () => {
        assert.equal(fqn.get(mdl1.func1), 'mdl1.func1');
    });
});
describe('js', () => {
    it('js.js1Fnc1', () => {
        assert.equal(fqn.get(js1Fnc1), 'js.js1Fnc1');
    });
    it('js.js1Fnc2', () => {
        assert.equal(fqn.get(js1Fnc2), 'js.js1Fnc2');
    });
    it('js.Js1Class1', () => {
        assert.equal(fqn.get(Js1Class1), 'js.Js1Class1');
    });
    it('js.Js1Class1.static1', () => {
        assert.equal(fqn.get(Js1Class1.static1), 'js.Js1Class1.static1');
    });
    it('js.js1Fnc2', () => {
        const ins = new js1Fnc2();
        assert.equal(fqn.get(ins), 'js.js1Fnc2');
    });


});
describe('single', () => {
    it('SingleClass1', () => {
        assert.equal(fqn.get(SingleClass1), 'SingleClass1');
    });
    it('SingleClass1.static1', () => {
        assert.equal(fqn.get(SingleClass1.static1), 'SingleClass1.static1');
    });
    it('singleClass1', () => {
        assert.equal(fqn.get(singleClass1), 'SingleClass1');
    });
    it('singleClass1.instance1', () => {
        assert.equal(fqn.get(singleClass1.instance1), 'SingleClass1.instance1');
    });
    it('singleFnc1', () => {
        assert.equal(fqn.get(singleFnc1), 'singleFnc1');
    });
    it('SingleFnc2', () => {
        assert.equal(fqn.get(SingleFnc2), 'SingleFnc2');
    });
    it('singleFnc2', () => {
        assert.equal(fqn.get(singleFnc2), 'SingleFnc2');
    });
});
describe('decorator', () => {
    it('test.SampleClass', () => {
        assert.equal(fqn.get(SampleClass), 'test.SampleClass');
    });
    it('test.SampleClass #instance', () => {
        const ins = new SampleClass();
        assert.equal(fqn.get(ins), 'test.SampleClass');
    });
    it('test.SampleClass.sampleMethod', () => {
        assert.equal(fqn.get(SampleClass.sampleMethod), 'test.SampleClass.sampleMethod');
    });
});
describe('getter-setter', () => {
    it('test.SampleClass', () => {
        assert.equal(fqn.get(GetterSetter), 'GetterSetter');
    });
});