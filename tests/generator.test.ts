import * as fs from 'fs';
import * as path from 'path';
import { generateValueObjectsFromClass } from '../src/generator';

// create temp files
const tempClassFilePath = path.join(__dirname, 'TempClass.ts');
const tempOutputDir = path.join(__dirname, 'tempOutput');

const tempClassFileContent = `
export class TempClass {
    private constructor(
        private id: number,
        private name: string,
        private isEnabled: boolean
    ) {}
}
`;

// delete temp files
beforeAll(() => {
    fs.writeFileSync(tempClassFilePath, tempClassFileContent);
    if (!fs.existsSync(tempOutputDir)) {
        fs.mkdirSync(tempOutputDir);
    }
});

// delete tmp files and dir
afterAll(() => {
    fs.unlinkSync(tempClassFilePath);
    fs.rmdirSync(tempOutputDir, { recursive: true });
});

test('generateValueObjectsFromClass generates correct value objects', () => {
    generateValueObjectsFromClass(tempClassFilePath, tempOutputDir);

    const expectedFiles = ['Id.ts', 'Name.ts', 'IsEnabled.ts'];
    expectedFiles.forEach(file => {
        const filePath = path.join(tempOutputDir, file);
        expect(fs.existsSync(filePath)).toBe(true);

        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/export class/);
        expect(content).toMatch(/static create/);
    });
});
