"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValueObjectsFromClass = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ts_morph_1 = require("ts-morph");
const generateValueObjectTemplate = (className, type) => `
export class ${className} {
    private constructor(private readonly value: ${type}) {}

    static create(value: ${type}): ${className} {
        if (!${className}.isValid(value)) {
            throw new Error('Invalid value');
        }
        return new ${className}(value);
    }

    getValue(): ${type} {
        return this.value;
    }

    private static isValid(value: ${type}): boolean {
        // validation logic here
        return true;
    }
}
`;
const createValueObjectFiles = (fields, outputDir) => {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fields.forEach(field => {
        const className = field.name.charAt(0).toUpperCase() + field.name.slice(1);
        const fileContent = generateValueObjectTemplate(className, field.type);
        const filePath = path.join(outputDir, `${className}.ts`);
        fs.writeFileSync(filePath, fileContent);
        console.log(`${filePath} has been created.`);
    });
};
const getTypeScriptType = (type) => {
    if (type.isString()) {
        return 'string';
    }
    if (type.isNumber()) {
        return 'number';
    }
    if (type.isBoolean()) {
        return 'boolean';
    }
    // Add other type mappings as needed
    return 'any';
};
const generateValueObjectsFromClass = (filePath, outputDir) => {
    const project = new ts_morph_1.Project();
    const sourceFile = project.addSourceFileAtPath(filePath);
    const classDeclaration = sourceFile.getClass(() => true);
    if (!classDeclaration) {
        throw new Error('No class found in the file');
    }
    const params = classDeclaration.getConstructors()[0].getParameters();
    const fields = params.map(property => {
        const name = property.getName();
        const type = property.getType();
        console.log(name, type);
        return { name, type: getTypeScriptType(type) };
    });
    createValueObjectFiles(fields, outputDir);
};
exports.generateValueObjectsFromClass = generateValueObjectsFromClass;
// コマンドライン引数からファイルパスと出力ディレクトリを取得
if (require.main === module) {
    const [inputFilePath, outputDirectory] = process.argv.slice(2);
    if (!inputFilePath || !outputDirectory) {
        console.error('Usage: npx ts-value-object-generator <input_file_path> <output_directory>');
        process.exit(1);
    }
    try {
        (0, exports.generateValueObjectsFromClass)(inputFilePath, outputDirectory);
    }
    catch (error) {
        console.error('Error generating value objects:', error);
    }
}
