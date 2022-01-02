type FuncAny = (...args: Array<unknown>) => unknown;
type ValueAny = FuncAny | unknown;

export interface IFqn {
    /**
     * Patches given object (function, class, file, module, namespace, ...)
     * */
    patch(obj: ValueAny, ...prefixes: Array<string>): void;
    patchModule(obj: ValueAny, depth?: number, ...prefixes: Array<string>): void;

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

// noinspection JSUnusedGlobalSymbols
class Fqn implements IFqn {
    // region property
    private static DEBUG = false;
    private static KEY = '$_fqn';
    private static SYS_FUNCTIONS: Array<string> = ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty',
        '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable',
        'toString', 'valueOf', '__proto__', 'toLocaleString', 'toJSON', '__esModule', '$_fqn'];
    private _sets: Set<unknown> = new Set<unknown>();
    // endregion property

    // region private-static
    private static _flatten<T>(value: T | Array<T>): Array<T> {
        const values: Array<T> = [];
        if (Array.isArray(value)) {
            values.push(...value);
        } else {
            values.push(value);
        }
        return values;
    }

    private static _setAttribute(holder: unknown, path: string, type: string): void {
        const desc = Object.getOwnPropertyDescriptor(holder, Fqn.KEY);
        if (desc) { return; }
        try {
            Object.defineProperty(holder, Fqn.KEY, {value: `${path}`, configurable: false, writable: false});
            if (Fqn.DEBUG) {
                console.log(`${type} =>> ${path}`);
            }
        } catch (e) {
            try {
                holder[Fqn.KEY] = path;
                if (Fqn.DEBUG) {
                    console.log(`${type} =>> ${path}`);
                }
            } catch (e) {
                if (Fqn.DEBUG) {
                    console.error(`!! ${type} =>> ${path}`, {message: e.message});
                }
            }
        }

    }

    private static _clearName(value: string): string | null {
        if (typeof value !== 'string') {
            return null;
        }
        value = value.trim();
        if (value !== '') {
            while (value.startsWith('.')) {
                value = value.substring(1).trim();
            }
        }
        if (value !== '') {
            while (value.endsWith('.')) {
                value = value.substring(0, value.length - 1).trim();
            }
        }
        return (value === '') ? null : value;
    }

    // endregion private-static

    // region private-instance
    private _run(obj: unknown, path: string, depth = -1): void {
        if (!obj) {
            return;
        }
        if (this._sets.has(obj)) {
            return;
        }
        this._sets.add(obj);
        if (path) {
            Fqn._setAttribute(obj, `${path}`, typeof obj === 'object' ? 'OBJECT' : 'FUNCTION');
        }
        this._run(Object.getPrototypeOf(obj), path, depth);
        Object.getOwnPropertyNames(obj).forEach(key => {
            if (!Fqn.SYS_FUNCTIONS.includes(key)) {
                const value = obj[key];
                if (!['function', 'object'].includes(typeof value)) {
                    return;
                }
                if (depth < 0) {
                    const cn = value.constructor?.name;
                    key = (cn === 'Function') ? value.name : cn;
                }
                const fullPath = path ? `${path}.${key}` : key;
                if (value) {
                    switch (typeof value) {
                        case "object":
                            this._run(value, fullPath, depth--);
                            break;
                        case "function":
                            if (value.prototype) {
                                let cPath;
                                if (path) {
                                    cPath = `${path}${(key === 'constructor') ? '' : '.' + key}`;
                                } else {
                                    cPath = (key === 'constructor') ? null : key;
                                }
                                Fqn._setAttribute(value.prototype, cPath, 'CLASS');
                                Object.getOwnPropertyNames(value.prototype).forEach(k2 => {
                                    if (['object', 'function'].includes(typeof value.prototype[k2])) {
                                        Fqn._setAttribute(value.prototype[k2], `${fullPath}${(k2 === 'constructor') ? '' : '.' + k2}`, 'PROTO2');
                                    }
                                });
                            }
                            Fqn._setAttribute(value, fullPath, 'INSTANCE');
                            Object.getOwnPropertyNames(value).forEach(k2 => {
                                if (k2 !== 'prototype' && ['object', 'function'].includes(typeof value[k2])) {
                                    Fqn._setAttribute(value[k2], `${fullPath}.${k2}`, 'STATIC');
                                }
                            });
                            break;
                    }
                }
            }
        });
    }

    // endregion private-instance


    // region public
    /**
     * Patches given object (function, class, file, module, namespace, ...)
     * */
    patch(obj: ValueAny, ...prefixes: Array<string>): void {
        const names = prefixes.map(value => Fqn._clearName(value)).filter(value => !!value);
        if (!obj || !['object', 'function'].includes(typeof obj)) {
            if (Fqn.DEBUG) {
                console.error(`Not valid object or function with type: ${typeof obj}`);
            }
        } else {
            this._run((typeof obj === 'function') ? obj.prototype : obj, names.length > 0 ? names.join('.') : null, -1);
        }
    }
    /**
     * Patches given object (function, class, file, module, namespace, ...)
     * */
    patchModule(obj: ValueAny, depth = 1, ...prefixes: Array<string>): void {
        const names = prefixes.map(value => Fqn._clearName(value)).filter(value => !!value);
        if (!obj || !['object', 'function'].includes(typeof obj)) {
            if (Fqn.DEBUG) {
                console.error(`Not valid object or function with type: ${typeof obj}`);
            }
        } else {
            this._run((typeof obj === 'function') ? obj.prototype : obj, names.length > 0 ? names.join('.') : null, depth);
        }
    }

    /**
     * Returns fqn key
     * */
    get key(): string {
        return Fqn.KEY;
    }

    /**
     * Returns fqn of given value
     * */
    get(value: unknown): string | undefined {
        try {
            switch (typeof value) {
                case 'string':
                    return value;
                case 'boolean':
                    return Boolean.name;
                case 'number':
                    return Number.name;
                case 'bigint':
                    return BigInt.name;
                case 'symbol':
                    return Symbol.name;
                case 'object':
                    return value[Fqn.KEY] ?? value.constructor[Fqn.KEY] ?? value.constructor.name ?? null;
                case "function":
                    return value[Fqn.KEY] ?? value.name ?? null;
            }
        } catch (e) {
        }
        return undefined;
    }

    /**
     * Binds given function with saving fqn
     * */
    fnBind<T extends FuncAny>(fn: T, holder: unknown): T {
        const fqnName = this.get(fn);
        fn = fn.bind(holder);
        Fqn._setAttribute(fn, fqnName, 'BIND');
        return fn;
    }

    /**
     * Binds given functions with saving fqn
     * */
    fnBindAll(holder: unknown, ...functions: Array<FuncAny>): void {
        functions.forEach(fn => this.fnBind(fn, holder));
    }

    // endregion public
}

export const fqn: IFqn = new Fqn();
fqn.patch({Fqn});