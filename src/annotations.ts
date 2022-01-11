import {FuncLike} from "@leyyo/core";
import {fqn} from "./FqnImpl";

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
// noinspection JSUnusedGlobalSymbols
export function FqnForce(...prefixes: Array<string>): ClassDecorator {
    return (target: unknown) => {
        fqn.patch({[(target as FuncLike).name]: target}, ...prefixes);
    };
}
