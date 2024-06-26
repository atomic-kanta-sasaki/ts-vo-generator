import * as fs from 'fs';
import * as path from 'path';
import { Project } from 'ts-morph';
import * as readline from 'readline';
import { TypeChecker } from './typeChecker';

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

export const generateValueObjectsFromClass = async (filePath: string, outputDir: string): Promise<void> => {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);
    const classDeclaration = sourceFile.getClass(() => true);

    if (!classDeclaration) {
        throw new Error('No class found in the file');
    }

    const params = classDeclaration.getConstructors()[0].getParameters();
    const fields = params.map(property => {
        const typeChecker = TypeChecker.new(property.getType());
        const name = property.getName();
        return { name, type: typeChecker.getTypeScriptType() };
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
