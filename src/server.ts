import dotenv from 'dotenv';
dotenv.config();
import {fqn} from "./index";
import * as s from "./samples/single";
import * as j from "./samples/js-style";
import * as m from "./samples/module1";
import * as n from "./samples/namespace1";
import * as i from "./samples/single";

console.log(fqn.key);
console.log(fqn.get(s.SingleClass1));
console.log(fqn.get(j.Js1Class1));
console.log(fqn.get(m.mdl1.Class2));
console.log(fqn.get(n.ns1.sub.Class1));
console.log(fqn.get(i.singleFnc1));

