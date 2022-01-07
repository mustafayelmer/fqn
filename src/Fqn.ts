import {Core, FuncLike} from "@leyyo/core";
import {DeveloperFqnException} from "./errors";

type ValueAny = FuncLike | unknown;

const _KEY = Symbol.for("@fqn");

export interface IFqn {
    /**
     * Patches given object (function, class, file, module, namespace, ...)
     * */
    patch(obj: ValueAny, ...prefixes: Array<string>): void;
    patchModule(obj: ValueAny, depth?: number, ...prefixes: Array<string>): void;

    /**
     * Returns fqn key
     * */
    get key(): Symbol;

    /**
     * Returns fqn of given value
     * */
    get(value: unknown): string | undefined;

    /**
     * Binds given function with saving fqn
     * */
    fnBind<T extends FuncLike>(fn: T, holder: unknown): T;

    /**
     * Binds given functions with saving fqn
     * */
    fnBindAll(holder: unknown, ...functions: Array<FuncLike>): void;
}
/**
 * Decorates class with optional prefixes
 *
 * Class fqn will be `{prefixes}.{class}`
 */
export function Fqn(...prefixes: Array<string>): ClassDecorator {
    return (target: unknown) => {
        fqn.patch({[(target as FuncLike).name]: target}, ...prefixes);
    };
}

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
class FqnImpl implements IFqn {
    // region property
    private static DEBUG = true;
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
    private static _log(severity: string, message: unknown, ...optionalParams: Array<unknown>) {
        if (!FqnImpl.DEBUG) {
            return;
        }
        console[severity](`[Fqn] - ${message}`, ...optionalParams);
    }
    private static _ignore(reason: string, params: Record<string, unknown>) {
        this._log('debug', reason, params);
    }
    private static _success(kind: string, path: string, params: Record<string, unknown>) {
        this._log('log', `${kind}: ${path}`, params);
    }
    private static _setAttribute(holder: unknown, path: string, type: string, ...keys: Array<string>): void {
        const desc = Object.getOwnPropertyDescriptor(holder, _KEY);
        if (desc) { return; }
        // if (holder[_KEY]) { return; }
        try {
            Object.defineProperty(holder, _KEY, {value: `${path}`, configurable: false, writable: false, enumerable: false});
            // FqnImpl._success('prop', path, {type, keys});
        } catch (e) {
            try {
                holder[_KEY] = path;
                // FqnImpl._success('direct', path, {type, keys});
            } catch (e) {
                FqnImpl._log('error', path, {message: e.message, type, keys});
            }
        }

    }

    private static _clearName(value: string): string | null {
        if (typeof value !== 'string') {
            throw new DeveloperFqnException('Invalid prefix', value);
        }
        value = value.trim();
        if (value === '') {
            return null;
        }
        while (value.startsWith('.')) {
            value = value.substring(1).trim();
            if (value === '') {
                return null;
            }
        }
        while (value.endsWith('.')) {
            value = value.substring(0, value.length - 1).trim();
            if (value === '') {
                return null;
            }
        }
        return value;
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
                // FqnImpl._ignore('isSymbol', {place: 1, path, key});
                return;
            }
            if (FqnImpl.SYS_FUNCTIONS.includes(key)) {
                // FqnImpl._ignore('isSystemFunction', {place: 1, path, key});
                return;
            }
            const value = obj[key];
            if (!value) {
                // FqnImpl._ignore('notValue', {place: 1, path, key});
                return;
            }
            if (!FqnImpl._isAllowed(value)) {
                // FqnImpl._ignore('isNotAllowed', {place: 1, path, key});
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
                                // FqnImpl._ignore('isSymbol', {place: 2, path, key, k2});
                                return;
                            }
                            if (['constructor'].includes(k2)) {
                                // FqnImpl._ignore('isSystemFunction', {place: 2, path, key, k2});
                                return;
                            }
                            const desc = Object.getOwnPropertyDescriptor(value.prototype, k2);
                            if (typeof desc?.value === 'function' && typeof desc?.get !== 'function') {
                                if (FqnImpl._isAllowed(value.prototype[k2])) {
                                    FqnImpl._setAttribute(value.prototype[k2], `${fullPath}${(k2 === 'constructor') ? '' : '.' + k2}`, 'PROTO2', key, k2);
                                } else {
                                    // FqnImpl._ignore('isNotAllowed', {place: 2, path, key, k2});
                                }
                            } else {
                                // FqnImpl._ignore('InvalidDescriptor', {place: 2, path, key, k2, value: typeof desc?.value, get: typeof desc?.get});
                            }
                        });
                    }
                    Object.getOwnPropertyNames(value).forEach(k2 => {
                        if (typeof key === 'symbol') {
                            // FqnImpl._ignore('isSymbol', {place: 3, path, key, k2});
                            return;
                        }
                        if (['prototype'].includes(k2)) {
                            // FqnImpl._ignore('isSystemFunction', {place: 3, path, key, k2});
                            return;
                        }
                        const desc = Object.getOwnPropertyDescriptor(value, k2);
                        if (typeof desc?.value === 'function' && typeof desc?.get !== 'function') {
                            if (FqnImpl._isAllowed(value[k2])) {
                                FqnImpl._setAttribute(value[k2], `${fullPath}.${k2}`, 'STATIC', key, k2);
                            } else {
                                // FqnImpl._ignore('isNotAllowed', {place: 3, path, key, k2});
                            }
                        } else {
                            // FqnImpl._ignore('InvalidDescriptor', {place: 3, path, key, k2, value: typeof desc?.value, get: typeof desc?.get});
                        }
                    });
                    break;
                default:
                    // FqnImpl._ignore('invalidType', {place: 1, path, key, type: typeof value});
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
    patch(obj: ValueAny, ...prefixes: Array<string>): void {
        const names = prefixes.map(value => FqnImpl._clearName(value)).filter(value => !!value);
        if (!obj || !FqnImpl._isAllowed(obj)) {
            throw new DeveloperFqnException('Invalid value', obj);
        } else {
            this._run((typeof obj === 'function') ? obj.prototype : obj, names.length > 0 ? names.join('.') : null, -1);
        }
    }
    /**
     * Patches given object (function, class, file, module, namespace, ...)
     * */
    patchModule(obj: ValueAny, depth = 1, ...prefixes: Array<string>): void {
        const names = prefixes.map(value => FqnImpl._clearName(value)).filter(value => !!value);
        if (!obj || !FqnImpl._isAllowed(obj)) {
            throw new DeveloperFqnException('Invalid value', obj);
        } else {
            this._run((typeof obj === 'function') ? obj.prototype : obj, names.length > 0 ? names.join('.') : null, depth);
        }
    }

    /**
     * Returns fqn key
     * */
    get key(): Symbol {
        return _KEY;
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
                    return value[_KEY] ?? value.constructor[_KEY] ?? value.constructor.name ?? null;
                case "function":
                    return value[_KEY] ?? value.name ?? null;
            }
        } catch (e) {
        }
        return undefined;
    }

    /**
     * Binds given function with saving fqn
     * */
    fnBind<T extends FuncLike>(fn: T, holder: unknown): T {
        const fqnName = this.get(fn);
        fn = fn.bind(holder);
        FqnImpl._setAttribute(fn, fqnName, 'BIND', fn.name);
        return fn;
    }

    /**
     * Binds given functions with saving fqn
     * */
    fnBindAll(holder: unknown, ...functions: Array<FuncLike>): void {
        functions.forEach(fn => this.fnBind(fn, holder));
    }

    // endregion public
}

export const fqn: IFqn = new FqnImpl();
fqn.patch({FqnImpl, Core}, 'leyyo');