![image](https://github.com/atomic-kanta-sasaki/typescript-value-object-generator/assets/49396455/adefcd3d-bebe-4101-891a-32f60d995f22)# ts-vo-generator
![image](https://github.com/atomic-kanta-sasaki/typescript-value-object-generator/assets/49396455/6787b715-d6ac-4040-b7c0-3e6483add91f)

`ts-vo-generator` is a tool to generate TypeScript Value Objects from classes. This tool allows you to easily create immutable data structures in TypeScript by generating Value Objects based on constructor arguments.

## Installation

Install `ts-vo-generator` globally using npm:

```bash
npm install -g ts-vo-generator
```

Or using Yarn:
```bash
yarn global add ts-vo-generator
```

## Usage
### Command Line Usage
To use `ts-vo-generator` from the command line, run the following command:
```bash
npx ts-vo-generator <input_file> <output_directory>
```

 - `<input_file>`: Path to the TypeScript file containing the class definitions from which you want to generate Value Objects.
 - `<output_directory>`: Path to the directory where the generated Value Objects will be output.
 - 
If a Value Object already exists in the output directory, the tool will prompt you to either overwrite the existing file or skip the operation.

### Example
Here's an example command to generate Value Objects from `User.ts` and output them to the `ValueObjects` directory:
```bash
npx ts-vo-generator ./src/models/User.ts ./src/ValueObjects
```

## Contributing
Contributions to this project are welcome! Fork the GitHub repository and submit a pull request. Bug reports and feature requests are also appreciated.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
```
You can copy this Markdown text into your README.md file for `ts-vo-generator`. Feel free to customize it further with specific details about your library and its usage.
```
