# fqn
FQN (Fully Qualified Name) for JavaScript/TypeScript

## Leyyo > FQN

- FQN (Fully Qualified Name) for JavaScript/TypeScript
- Provides decorator for only class, because module, namespace and functions are not allowed for decorators
- Support Class, Function, Namespace, Module and File
- Support to prevent to rename names of function while binding

## TODO
- getter

## Install
``npm i @leyyo/fqn``

## Standards
- Language: `TS`
- Eslint: `Yes`
- Static Code Analysis: `Yes` *IntelliJ Code Inspections*
- DDD - Document Driven: `No`
- EDD - Exception Driven: `Yes`
- TDD - Test Driven: `Yes` [go to test folder](./test/)

## Commands
- ``npm run clear`` *// clears "dist" folder*
- ``npm run lint`` *// runs eslint for static code analysis*
- ``npm run build`` *// builds JS files at "dist" folder*
- ``npm run test`` *// runs test files in "test" folder*
- ``npm run test:watch`` *// runs test with watch option
- ``npm run test:coverage`` *// runs test with coverage

## Usage
### Interface
```typescript
export interface Fqn {
    /**
     * Patches given object (function, class, file, ...)
     * */
    patch(targets: { ... }, ...prefixes: Array<string>): void;
    /**
     * Patches given object (module, namespace)
     * */
    patchModule(targets: { ... }, depth?: number, ...prefixes: Array<string>): void;

    /**
     * Returns fqn key
     * */
    get key(): string;

    /**
     * Returns fqn of given value
     * */
    get(value: unknown): string | undefined;

    /**
     * Binds given function with saving fqn
     * */
    fnBind<T extends FuncAny>(fn: T, holder: unknown): T;

    /**
     * Binds given functions with saving fqn
     * */
    fnBindAll(holder: unknown, ...functions: Array<FuncAny>): void;
}

```
### Decorator
```typescript
import {fqn} from "@leyyo/fqn";

@Fqn('test')
class SampleClass {
    static staticMethod() {}
    instanceMethod() {}
}

console.log(fqn.get(SampleClass)); // test.SampleClass
console.log(fqn.get(SampleClass.staticMethod)); // test.SampleClass.staticMethod

const instance = new SampleClass();
console.log(fqn.get(instance)); // test.SampleClass
console.log(fqn.get(instance.instanceMethod)); // test.SampleClass.instanceMethod
```

### Classes and Functions
```typescript
import {fqn} from "@leyyo/fqn";

export class MyClass {}
export function myFunction() {}
export const myArrow = () => {}
// patch({...}, ...names: string[]);
fqn.patch({MyClass, MyFunction, myArrow}, 'company', 'project');

console.log(fqn.get(MyClass)); // company.project.MyClass
console.log(fqn.get(myFunction)); // company.project.myFunction
console.log(fqn.get(myArrow)); // company.project.myArrow
console.log(fqn.get(new MyClass())); // company.project.MyClass
console.log(fqn.get(new myFunction())); // company.project.myFunction
```

### Module
```typescript
import {fqn} from "@leyyo/fqn";

export module mammal {
    export abstract class Base {
        static drink(): void {
        }
    }

    export class Cat extends Base {
        meow(): void {
        }

        static drink(): void {
        }
    }

    export class Dog extends Base {
        woof(): void {
        }
    }

    export function hello() {
    }

    export const world = () => {
    }
}
fqn.patchModule({mammal}, 1, 'animal');

// in other files or projects
const cat = new mammal.Cat();
const dog = new mammal.Dog();

console.log(fqn.get(mammal)); // animal.mammal
console.log(fqn.get(mammal.Base)); // animal.mammal.Base
console.log(fqn.get(mammal.Base.drink)); // animal.mammal.Base.drink
console.log(fqn.get(mammal.Cat)); // animal.mammal.Cat
console.log(fqn.get(mammal.Cat.drink)); // animal.mammal.Cat.drink ## overriden
console.log(fqn.get(cat.meow)); // animal.mammal.Cat.meow
console.log(fqn.get(mammal.Dog)); // animal.mammal.Dog
console.log(fqn.get(mammal.Dog.drink)); // animal.mammal.Base.drink ## inherited
console.log(fqn.get(dog.woof)); // animal.mammal.Dog.woof
```

### Namespaces
```typescript
import {fqn} from "@leyyo/fqn";

export namespace iam {
    export abstract class User {
        static add(): void {}
    }
    export namespace visitor {
        export class User extends iam.User {
            static visitPage(): void {}
        }
        export function hello() {}
    }
    export namespace admin {
        export class User extends iam.User {
            static getRoles(): void {}
        }
        export function hello() {}
    }
}
fqn.patchModule({iam}); // there is no any prefix

// in other files or projects
console.log(fqn.get(iam)); // iam
console.log(fqn.get(iam.User)); // iam.User
console.log(fqn.get(iam.User.add)); // iam.User.add
console.log(fqn.get(iam.visitor)); // iam.visitor
console.log(fqn.get(iam.visitor.User)); // iam.visitor.User
console.log(fqn.get(iam.visitor.User.add)); // iam.User.add // ## inherited
console.log(fqn.get(iam.visitor.User.visitPage)); // iam.visitor.User.visitPage
console.log(fqn.get(iam.visitor.hello)); // iam.visitor.hello
console.log(fqn.get(iam.admin)); // iam.admin
console.log(fqn.get(iam.admin.User)); // iam.admin.User
console.log(fqn.get(iam.admin.User.add)); // iam.User.add // ## inherited
console.log(fqn.get(iam.admin.User.getRoles)); // iam.admin.User.getRoles
console.log(fqn.get(iam.admin.hello)); // iam.admin.hello
```

### All in a file
```typescript
import {fqn} from "@leyyo/fqn";

export class Cat {
    static meow(): void {}
    drink(): void {}
}
export function hello() {}
export const world = () => {}
// with custom prefix
fqn.patch(this, 'myUtils');

// in other files or projects
console.log(fqn.get(Cat)); // myUtils.Cat
console.log(fqn.get(Cat.meow)); // myUtils.Cat.meow
console.log(fqn.get((new Cat()).drink)); // myUtils.Cat.drink
console.log(fqn.get(hello)); // myUtils.hello
console.log(fqn.get(world)); // myUtils.world
console.log(fqn.get(new hello())); // myUtils.hello
```

## Author
- `Date` 2021-11-01
- `Name` Mustafa Yelmer
- `Repo` [github.com/mustafayelmer/fqn](https://github.com/mustafayelmer/fqn)
