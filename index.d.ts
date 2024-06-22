// index.d.ts

declare module 'typescript-value-object-generator' {
    export function generateValueObjectsFromClass(
        filePath: string,
        outputDir: string
    ): void;
}