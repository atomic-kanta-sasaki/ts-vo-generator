import { Type } from 'ts-morph';

export class TypeChecker {
    private readonly type: Type;

    private constructor(type: Type) {
        this.type = type;
    }

    static new(type: Type): TypeChecker {
        return new TypeChecker(type);
    }

    getTypeScriptType(): string {
        if (this.type.isString()) {
            return 'string';
        } else if (this.type.isNumber()) {
            return 'number';
        } else if (this.type.isBoolean()) {
            return 'boolean';
        } else if (this.type.isArray()) {
            const elementType = this.type.getArrayElementTypeOrThrow();
            return `${this.getTypeScriptTypeFromElement(elementType)}[]`;
        } else if (this.type.isClassOrInterface() || this.type.isObject()) {
            return 'object';
        } else if (this.type.isUndefined()) {
            return 'undefined';
        } else if (this.type.isNull()) {
            return 'null';
        } else if (this.type.isEnum() || this.type.isEnumLiteral()) {
            return 'enum';
        } else {
            return 'any';
        }
    }

    private getTypeScriptTypeFromElement(type: Type): string {
        if (type.isString()) {
            return 'string';
        } else if (type.isNumber()) {
            return 'number';
        } else if (type.isBoolean()) {
            return 'boolean';
        } else {
            return 'unknown';
        }
    }
}
