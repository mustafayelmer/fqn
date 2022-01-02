import { strict as assert } from 'assert';
import {fqn} from "../src";
import {ns1} from "./samples/namespace1";
import {ns2} from "./samples/namespace2";
import {mdl1} from "./samples/module1";
import {Js1Class1, js1Fnc1, js1Fnc2} from "./samples/js-style";
import {SingleClass1, singleClass1, singleFnc1, SingleFnc2, singleFnc2} from "./samples/single";

const insNs11 = new ns1.sub.Class1();
const insNs12 = new ns1.sub.Class2();
const insNs21 = new ns2.Class1();
const insNs22 = new ns2.sub.Class2();
const insMdl11 = new mdl1.Class1();
const insMdl12 = new mdl1.Class2();
const insJs1Fnc2 = new js1Fnc2();

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
        assert.equal(insNs11.instance1[fqn.key], 'ns1.sub.Class1.instance1');
    });
    it('ns1.sub.Class1.instance2', () => {
        assert.equal(insNs11.instance2[fqn.key], 'ns1.sub.Class1.instance2');
    });


    it('ns1.sub.Class2', () => {
        assert.equal(ns1.sub.Class2[fqn.key], 'ns1.sub.Class2');
    });
    it('ns1.sub.Class2 #prototype', () => {
        assert.equal(ns1.sub.Class2.prototype[fqn.key], 'ns1.sub.Class2');
    });
    it('ns1.sub.Class2.static1 #inherited', () => {
        assert.equal(ns1.sub.Class2.static1[fqn.key], 'ns1.sub.Class1.static1');
    });
    it('ns1.sub.Class2.static2 #overridden', () => {
        assert.equal(ns1.sub.Class2.static2[fqn.key], 'ns1.sub.Class2.static2');
    });
    it('ns1.sub.Class2.static3', () => {
        assert.equal(ns1.sub.Class2.static3[fqn.key], 'ns1.sub.Class2.static3');
    });
    it('ns1.sub.Class2.instance1 #inherited', () => {
        assert.equal(insNs12.instance1[fqn.key], 'ns1.sub.Class1.instance1');
    });
    it('ns1.sub.Class2.instance2 #overridden', () => {
        assert.equal(insNs12.instance2[fqn.key], 'ns1.sub.Class2.instance2');
    });
    it('ns1.sub.Class2.instance3', () => {
        assert.equal(insNs12.instance3[fqn.key], 'ns1.sub.Class2.instance3');
    });
    it('ns1.sub.func1', () => {
        assert.equal(ns1.sub.func1[fqn.key], 'ns1.sub.func1');
    });
});
describe('namespace #nested', () => {
    it('ns2', () => {
        assert.equal(ns2[fqn.key], 'ns2');
    });
    it('ns2.sub', () => {
        assert.equal(ns2.sub[fqn.key], 'ns2.sub');
    });
    it('ns2.Class1', () => {
        assert.equal(ns2.Class1[fqn.key], 'ns2.Class1');
    });
    it('ns2.Class1 #prototype', () => {
        assert.equal(ns2.Class1.prototype[fqn.key], 'ns2.Class1');
    });
    it('ns2.Class1.static1', () => {
        assert.equal(ns2.Class1.static1[fqn.key], 'ns2.Class1.static1');
    });
    it('ns2.Class1.static2', () => {
        assert.equal(ns2.Class1.static2[fqn.key], 'ns2.Class1.static2');
    });
    it('ns2.Class1.instance1', () => {
        assert.equal(insNs21.instance1[fqn.key], 'ns2.Class1.instance1');
    });
    it('ns2.Class1.instance2', () => {
        assert.equal(insNs21.instance2[fqn.key], 'ns2.Class1.instance2');
    });


    it('ns2.sub.Class2', () => {
        assert.equal(ns2.sub.Class2[fqn.key], 'ns2.sub.Class2');
    });
    it('ns2.sub.Class2 #prototype', () => {
        assert.equal(ns2.sub.Class2.prototype[fqn.key], 'ns2.sub.Class2');
    });
    it('ns2.sub.Class2.static1 #inherited', () => {
        assert.equal(ns2.sub.Class2.static1[fqn.key], 'ns2.Class1.static1');
    });
    it('ns2.sub.Class2.static2 #overridden', () => {
        assert.equal(ns2.sub.Class2.static2[fqn.key], 'ns2.sub.Class2.static2');
    });
    it('ns2.sub.Class2.static3', () => {
        assert.equal(ns2.sub.Class2.static3[fqn.key], 'ns2.sub.Class2.static3');
    });
    it('ns2.sub.Class2.instance1 #inherited', () => {
        assert.equal(insNs22.instance1[fqn.key], 'ns2.Class1.instance1');
    });
    it('ns2.sub.Class2.instance2 #overridden', () => {
        assert.equal(insNs22.instance2[fqn.key], 'ns2.sub.Class2.instance2');
    });
    it('ns2.sub.Class2.instance3', () => {
        assert.equal(insNs22.instance3[fqn.key], 'ns2.sub.Class2.instance3');
    });
    it('ns2.sub.func1', () => {
        assert.equal(ns2.func1[fqn.key], 'ns2.func1');
    });
});

describe('module', () => {
    it('mdl1', () => {
        assert.equal(mdl1[fqn.key], 'mdl1');
    });
    it('mdl1.Class1', () => {
        assert.equal(mdl1.Class1[fqn.key], 'mdl1.Class1');
    });
    it('mdl1.Class1 #prototype', () => {
        assert.equal(mdl1.Class1.prototype[fqn.key], 'mdl1.Class1');
    });
    it('mdl1.Class1.static1', () => {
        assert.equal(mdl1.Class1.static1[fqn.key], 'mdl1.Class1.static1');
    });
    it('mdl1.Class1.static2', () => {
        assert.equal(mdl1.Class1.static2[fqn.key], 'mdl1.Class1.static2');
    });
    it('mdl1.Class1.instance1', () => {
        assert.equal(insMdl11.instance1[fqn.key], 'mdl1.Class1.instance1');
    });
    it('mdl1.Class1.instance2', () => {
        assert.equal(insMdl11.instance2[fqn.key], 'mdl1.Class1.instance2');
    });


    it('mdl1.Class2', () => {
        assert.equal(mdl1.Class2[fqn.key], 'mdl1.Class2');
    });
    it('mdl1.Class2 #prototype', () => {
        assert.equal(mdl1.Class2.prototype[fqn.key], 'mdl1.Class2');
    });
    it('mdl1.Class2.static1 #inherited', () => {
        assert.equal(mdl1.Class2.static1[fqn.key], 'mdl1.Class1.static1');
    });
    it('mdl1.Class2.static2 #overridden', () => {
        assert.equal(mdl1.Class2.static2[fqn.key], 'mdl1.Class2.static2');
    });
    it('mdl1.Class2.static3', () => {
        assert.equal(mdl1.Class2.static3[fqn.key], 'mdl1.Class2.static3');
    });
    it('mdl1.Class2.instance1 #inherited', () => {
        assert.equal(insMdl12.instance1[fqn.key], 'mdl1.Class1.instance1');
    });
    it('mdl1.Class2.instance2 #overridden', () => {
        assert.equal(insMdl12.instance2[fqn.key], 'mdl1.Class2.instance2');
    });
    it('mdl1.Class2.instance3', () => {
        assert.equal(insMdl12.instance3[fqn.key], 'mdl1.Class2.instance3');
    });
    it('mdl1.func1', () => {
        assert.equal(mdl1.func1[fqn.key], 'mdl1.func1');
    });
});
describe('js', () => {
    it('js.js1Fnc1', () => {
        assert.equal(js1Fnc1[fqn.key], 'js.js1Fnc1');
    });
    it('js.js1Fnc2', () => {
        assert.equal(js1Fnc2[fqn.key], 'js.js1Fnc2');
    });
    it('js.Js1Class1', () => {
        assert.equal(Js1Class1[fqn.key], 'js.Js1Class1');
    });
    it('js.Js1Class1.static1', () => {
        assert.equal(Js1Class1.static1[fqn.key], 'js.Js1Class1.static1');
    });
    it('js.js1Fnc2', () => {
        assert.equal(insJs1Fnc2[fqn.key], 'js.js1Fnc2');
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