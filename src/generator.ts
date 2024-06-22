import * as fs from 'fs';
import * as path from 'path';
import { Project, Type } from 'ts-morph';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generateValueObjectTemplate = (className: string, type: string) => `
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

const askUser = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const createValueObjectFiles = async (fields: { name: string; type: string }[], outputDir: string) => {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const field of fields) {
        const className = field.name.charAt(0).toUpperCase() + field.name.slice(1);
        const filePath = path.join(outputDir, `${className}.ts`);

        if (fs.existsSync(filePath)) {
            const answer = await askUser(`File ${filePath} already exists. Do you want to overwrite it? (y/n): `);
            if (answer.toLowerCase() !== 'y') {
                console.log(`Skipping file: ${filePath}`);
                continue;
            }
        }

        const fileContent = generateValueObjectTemplate(className, field.type);
        fs.writeFileSync(filePath, fileContent);
        console.log(`Created file: ${filePath}`);
    }

    rl.close();
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

export const generateValueObjectsFromClass = async (filePath: string, outputDir: string): Promise<void> => {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);
    const classDeclaration = sourceFile.getClass(() => true);

    if (!classDeclaration) {
        throw new Error('No class found in the file');
    }

    const params = classDeclaration.getConstructors()[0].getParameters();

    const fields = params.map(property => {
        const name = property.getName();
        const type = property.getType();
        return { name, type: getTypeScriptType(type) };
    });

    await createValueObjectFiles(fields, outputDir);
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
