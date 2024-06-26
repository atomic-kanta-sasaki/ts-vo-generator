export class TypeChecker {
    constructor(private value: any) {}

    isString(): boolean {
        return typeof this.value === 'string';
    }

    isNumber(): boolean {
        return typeof this.value === 'number';
    }

    isBoolean(): boolean {
        return typeof this.value === 'boolean';
    }

    isDate(): boolean {
        return this.value instanceof Date;
    }

    isArray(): boolean {
        return Array.isArray(this.value);
    }

    isObject(): boolean {
        return this.value !== null && typeof this.value === 'object' && !Array.isArray(this.value) && !(this.value instanceof Date);
    }

    isBuffer(): boolean {
        return Buffer.isBuffer(this.value);
    }

    isFile(): boolean {
        return this.value instanceof File;
    }


    getTypeScriptType(): string {
        if (this.value.isString()) {
            return 'string';
        }
        if (this.value.isNumber()) {
            return 'number';
        }
        if (this.value.isBoolean()) {
            return 'boolean';
        }
        if (this.value.isDate()) {
            return 'Date';
        }
        if (this.value.isArray()) {
            return 'Array';
        }
        if (this.value.isObject()) {
            return 'Object';
        }
        if (this.value.isBuffer()) {
            return 'Buffer';
        }
        if (this.value.isFile()) {
            return 'File';
        }
        return 'any';
    }

    static new(value: any): TypeChecker {
        return new TypeChecker(value);
    }
}