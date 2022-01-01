# fqn
FQN (Fully Qualified Name) for JavaScript/TypeScript

# Leyyo > FQN

- FQN (Fully Qualified Name) for JavaScript/TypeScript
- Support Class, Function, Namespace, Module and File
- Support to prevent to rename names of function while binding

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

## Install
``npm i @leyyo/fqn``

## todo
### Usage
```typescript
import {fqn} from "@leyyo/fqn";
export class MyClass {}
export function myFunction1() {}
export const myFunction2 = () => {}
export module myModule {}
export namespace myNamespace {}

// with one name
fqn.patch('foo', Class1, myFunction1, myFunction2, myModule, myNamespace);

// with prefixes
fqn.patch(['com', 'yourcompany', 'sample'], Class1, myFunction1, myFunction2, myModule, myNamespace);

// in other files or projects
console.log(fqn.get(foo.bar.Cat.meow)); // foo.bar.Cat.meow
console.log(fqn.get(foo.bar.hello)); // foo.bar.hello
console.log(fqn.get(foo.bar.world)); // foo.bar.world

const cat = new foo.bar.Cat();
console.log(fqn.get(cat.drink)); // foo.bar.Cat.drink
const hello = new foo.bar.hello();
console.log(fqn.get(hello)); // foo.bar.hello
```

### Namespace
```typescript
import {fqn} from "@leyyo/fqn";

export namespace foo {
    export namespace bar {
        export class Cat {
            static meow(): void {}
            drink(): void {}
        }
        export function hello() {}
        export const world = () => {}
    }
}
fqn.patch('foo', foo);

// in other files or projects
console.log(fqn.get(foo.bar.Cat.meow)); // foo.bar.Cat.meow
console.log(fqn.get(foo.bar.hello)); // foo.bar.hello
console.log(fqn.get(foo.bar.world)); // foo.bar.world

const cat = new foo.bar.Cat();
console.log(fqn.get(cat.drink)); // foo.bar.Cat.drink
const hello = new foo.bar.hello();
console.log(fqn.get(hello)); // foo.bar.hello
```


### Module
```typescript
import {fqn} from "@leyyo/fqn";

export module fooBar {
    export class Cat {
        static meow(): void {}
        drink(): void {}
    }
    export function hello() {}
    export const world = () => {}
}
fqn.patch('fooBar', fooBar);

// in other files or projects
console.log(fqn.get(fooBar.Cat.meow)); // fooBar.Cat.meow
console.log(fqn.get(fooBar.hello)); // fooBar.hello
console.log(fqn.get(fooBar.world)); // fooBar.world

const cat = new fooBar.Cat();
console.log(fqn.get(cat.drink)); // fooBar.Cat.drink
const hello = new fooBar.hello();
console.log(fqn.get(hello)); // fooBar.hello
```

### Class
```typescript
import {fqn} from "@leyyo/fqn";

export class Cat {
    static meow(): void {}
    drink(): void {}
}
// with custom prefix
fqn.patch(['myProject', 'Cat'], Cat);

// in other files or projects
console.log(fqn.get(Cat)); // myProject.Cat
console.log(fqn.get(Cat.meow)); // myProject.Cat.meow

const cat = new Cat();
console.log(fqn.get(cat.drink)); // myProject.Cat.drink
```

### Class Direct
```typescript
import {fqn} from "@leyyo/fqn";

export class Cat {
    static meow(): void {}
    drink(): void {}
}
// with custom prefix
fqn.patchOne(Cat, 'anotherProject'); // custom property optional as ...names: String[]

// in other files or projects
console.log(fqn.get(Cat)); // anotherProject.Cat
console.log(fqn.get(Cat.meow)); // anotherProject.Cat.meow

const cat = new Cat();
console.log(fqn.get(cat.drink)); // anotherProject.Cat.drink
```

### Function
```typescript
import {fqn} from "@leyyo/fqn";

export function hello() {}
export const world = () => {}
// with custom prefix
fqn.patch('myUtils', hello, world);

// in other files or projects
console.log(fqn.get(hello)); // myUtils.hello
console.log(fqn.get(world)); // myUtils.world

const hello2 = new hello();
console.log(fqn.get(hello2)); // myUtils.hello
```