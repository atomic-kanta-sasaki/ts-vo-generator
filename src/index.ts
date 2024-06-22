#!/usr/bin/env node
'use strict';
import { generateValueObjectsFromClass } from './generator';
import * as path from 'path';

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('Usage: typescript-value-object-generator <input_file> <output_directory>');
    process.exit(1);
}

const [inputFile, outputDir] = args;
const absoluteInputFile = path.resolve(inputFile);
const absoluteOutputDir = path.resolve(outputDir);

try {
    generateValueObjectsFromClass(absoluteInputFile, absoluteOutputDir);
    console.log('success');
} catch (error) {
    console.error('failed', error);
    process.exit(1);
}
