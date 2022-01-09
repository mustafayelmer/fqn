// noinspection JSUnusedGlobalSymbols

import {FqnLike, FqnValueLike, FuncLike, Leyyo, Severity} from "@leyyo/core";

class FqnImpl implements FqnLike {
    // region property
    private static SYS_FUNCTIONS: Array<string> = ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty',
        '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable',
        'toString', 'valueOf', '__proto__', 'toLocaleString', 'toJSON', '__esModule'];
    private static SYS_CLASSES: Array<string> = ['Function', 'Object', 'Map', 'Array', 'String', 'Number', 'Exception'];
    private static ALLOWED: Array<string> = ['object', 'function'];
    private readonly _sets: Set<unknown> = new Set<unknown>();
    // endregion property

    // region private-static
    private static _isAllowed(value: unknown): boolean {
        return this.ALLOWED.includes(typeof value);
    }
    private static _setAttribute(holder: unknown, path: string, type: string, ...keys: Array<string>): void {
        const desc = Object.getOwnPropertyDescriptor(holder, Leyyo.FQN_KEY);
        if (desc) { return; }
        try {
            Object.defineProperty(holder, Leyyo.FQN_KEY, {value: `${path}`, configurable: false, writable: false, enumerable: false});
            Leyyo.log(FqnImpl, Severity.INFO, path, {type, keys});
        } catch (e) {
            try {
                holder[Leyyo.FQN_KEY] = path;
                Leyyo.log(FqnImpl, Severity.INFO, path, {type, keys});
            } catch (e) {
                Leyyo.log(FqnImpl, Severity.WARN, e.message, {name: e.name, type, keys});
            }
        }

    }

    private static _clearName(value: string): string | null {
        if (typeof value !== 'string') {
            Leyyo.raise(FqnImpl, 'Invalid prefix', {value});
        }
        let name = Leyyo.clazz(value);
        if (!name) {return null;}
        while (name.startsWith('.')) {
            name = Leyyo.clazz(name.substring(1));
            if (!name) {return null;}
        }
        while (name.endsWith('.')) {
            name = Leyyo.clazz(name.substring(0, name.length - 1));
            if (!name) {return null;}
        }
        return name;
    }

    // endregion private-static

    // region private-instance
    private _run(obj: unknown, path: string, depth = -1): void {
        if (!obj) {
            return;
        }
        if (!FqnImpl._isAllowed(obj)) {
            return;
        }
        if (typeof obj === 'function') {
            const subName = (obj as FuncLike)?.name;
            if (subName && FqnImpl.SYS_CLASSES.includes(subName)) {
                return;
            }
        }
        if (this._sets.has(obj)) {
            return;
        }
        this._sets.add(obj);
        if (path) {
            FqnImpl._setAttribute(obj, `${path}`, typeof obj === 'object' ? 'OBJECT' : 'FUNCTION');
        }
        if (typeof obj === 'object') {
            const parent = Object.getPrototypeOf(obj);
            if (parent) {
                this._run(parent, path, depth);
            }
        }
        Object.getOwnPropertyNames(obj).forEach(key => {
            if (typeof key === 'symbol') {
                return;
            }
            if (FqnImpl.SYS_FUNCTIONS.includes(key)) {
                return;
            }
            const value = obj[key];
            if (!value) {
                return;
            }
            if (!FqnImpl._isAllowed(value)) {
                return;
            }
            if (depth < 0) {
                const cn = value.constructor?.name;
                key = (cn === 'Function') ? value.name : cn;
            }
            const fullPath = path ? `${path}.${key}` : key;
            switch (typeof value) {
                case "object":
                    this._run(value, fullPath, depth--);
                    break;
                case "function":
                    FqnImpl._setAttribute(value, fullPath, 'INSTANCE', key);
                    if (value.prototype) {
                        let cPath;
                        if (path) {
                            cPath = `${path}${(key === 'constructor') ? '' : '.' + key}`;
                        } else {
                            cPath = (key === 'constructor') ? null : key;
                        }
                        FqnImpl._setAttribute(value.prototype, cPath, 'CLASS', key);
                        Object.getOwnPropertyNames(value.prototype).forEach(k2 => {
                            if (typeof key === 'symbol') {
                                return;
                            }
                            if (['constructor'].includes(k2)) {
                                return;
                            }
                            const desc = Object.getOwnPropertyDescriptor(value.prototype, k2);
                            if (typeof desc?.value === 'function' && typeof desc?.get !== 'function') {
                                if (FqnImpl._isAllowed(value.prototype[k2])) {
                                    FqnImpl._setAttribute(value.prototype[k2], `${fullPath}${(k2 === 'constructor') ? '' : '.' + k2}`, 'PROTO2', key, k2);
                                }
                            }
                        });
                    }
                    Object.getOwnPropertyNames(value).forEach(k2 => {
                        if (typeof key === 'symbol') {
                            return;
                        }
                        if (['prototype'].includes(k2)) {
                            return;
                        }
                        const desc = Object.getOwnPropertyDescriptor(value, k2);
                        if (typeof desc?.value === 'function' && typeof desc?.get !== 'function') {
                            if (FqnImpl._isAllowed(value[k2])) {
                                FqnImpl._setAttribute(value[k2], `${fullPath}.${k2}`, 'STATIC', key, k2);
                            }
                        }
                    });
                    break;
            }
        });
    }

    // endregion private-instance

    constructor() {
        setTimeout(() => {
            this._sets.clear();
        }, 5000);
    }
    // region public
    /**
     * Patches given object (function, class, file, module, namespace, ...)
     * */
    patch(obj: FqnValueLike, ...prefixes: Array<string>): void {
        const names = prefixes.map(value => FqnImpl._clearName(value)).filter(value => !!value);
        if (!obj || !FqnImpl._isAllowed(obj)) {
            Leyyo.raise(FqnImpl, 'Invalid value', {value: obj});
        } else {
            this._run((typeof obj === 'function') ? obj.prototype : obj, names.length > 0 ? names.join('.') : null, -1);
        }
    }
    /**
     * Patches given object (function, class, file, module, namespace, ...)
     * */
    patchModule(obj: FqnValueLike, depth = 1, ...prefixes: Array<string>): void {
        const names = prefixes.map(value => FqnImpl._clearName(value)).filter(value => !!value);
        if (!obj || !FqnImpl._isAllowed(obj)) {
            Leyyo.raise(FqnImpl, 'Invalid value', {value: obj});
        } else {
            this._run((typeof obj === 'function') ? obj.prototype : obj, names.length > 0 ? names.join('.') : null, depth);
        }
    }

    /**
     * Returns fqn key
     * */
    get key(): Symbol {
        return Leyyo.FQN_KEY;
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
                    return value[Leyyo.FQN_KEY] ?? value.constructor[Leyyo.FQN_KEY] ?? value.constructor.name ?? undefined;
                case "function":
                    return value[Leyyo.FQN_KEY] ?? value.name ?? undefined;
            }
        } catch (e) {
        }
        return undefined;
    }

    /**
     * Binds given function with saving fqn
     * */
    fnBind(owner: unknown, method: FuncLike): void {
        const fqnName = this.get(method);
        method = method.bind(owner);
        FqnImpl._setAttribute(method, fqnName, 'BIND', method.name);
    }

    /**
     * Binds given functions with saving fqn
     * */
    fnBindAll(owner: unknown, ...methods: Array<FuncLike>): void {
        methods.forEach(method => this.fnBind(owner, method));
    }

    patchModuleOverwrite(obj: FqnValueLike, depth?: number, ...prefixes: Array<string>): void {
    }

    patchOverwrite(obj: FqnValueLike, ...prefixes: Array<string>): void {
    }

    // endregion public
}
export const fqn: FqnLike = new FqnImpl();
Leyyo.patch(FqnImpl);
Leyyo.fqnSet(fqn);


