import * as fs from 'fs';
import * as path from 'path';
import { Project, Type } from 'ts-morph';

const generateValueObjectTemplate = (className: string, type: string) => `
export class ${className} {
    private constructor(private readonly value: ${type}) {}

    static create(value: ${type}): ${className} {
        return new ${className}(value);
    }

    getValue(): ${type} {
        return this.value;
    }
}
`;

const createValueObjectFiles = (fields: { name: string; type: string }[], outputDir: string) => {
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

const getTypeScriptType = (type: Type): string => {
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

export const generateValueObjectsFromClass = (filePath: string, outputDir: string) => {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);
    const classDeclaration = sourceFile.getClass(() => true);

    if (!classDeclaration) {
        throw new Error('No class found in the file');
    }

    const fields = classDeclaration.getProperties().map(property => {
        const name = property.getName();
        const type = property.getType();
        console.log(name, type)
        return { name, type: getTypeScriptType(type) };
    });

    createValueObjectFiles(fields, outputDir);
};

// コマンドライン引数からファイルパスと出力ディレクトリを取得
if (require.main === module) {
    const [inputFilePath, outputDirectory] = process.argv.slice(2);

    if (!inputFilePath || !outputDirectory) {
        console.error('Usage: npx ts-value-object-generator <input_file_path> <output_directory>');
        process.exit(1);
    }

    try {
        generateValueObjectsFromClass(inputFilePath, outputDirectory);
    } catch (error) {
        console.error('Error generating value objects:', error);
    }
}
