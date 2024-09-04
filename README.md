# auto-readme-creator

`auto-readme-creator` is a command-line tool that automatically generates a `README.md` file based on comments in your code files. It scans your project files for comments and generates a formatted README to help document your project.

## Installation

You can install `auto-readme-creator` globally using npm:

```bash
npm install -g auto-readme-creator
```

## Usage

After installing, you can use `auto-readme-creator` to generate a `README.md` file in your project directory. The tool will scan your source files and create a README based on the comments found in those files.

### Navigate to Your Project Directory

Open your terminal and navigate to the root directory of your project:

```bash
cd /path/to/your/project
```
## Run the Command
Execute the `auto-readme-creator` command:

```bash
auto-readme-creator
```

## How It Works
auto-readme-creator performs the following tasks:

- Scans Code Files: It searches through your code files (e.g., .js, .ts, etc.) in the src directory (or a directory specified in your project).
- Extracts Comments: It extracts comments formatted as documentation.
- Generates README: It creates a README.md file with a summary of the extracted comments, organizing them into sections.

## Adding npm Global Bin Directory to PATH

To ensure that globally installed npm packages are accessible from the command line, you may need to add the npm global bin directory to your PATH environment variable. Here’s how to do it on Windows and macOS:

### On Windows

1. **Find the npm Global Directory**

   Run the following command in your terminal to find the global npm directory:

```bash
   npm config get prefix
```
This will return a path, such as `C:\Users\YourUsername\AppData\Roaming\npm.`

## Contributing

Contributions are welcome! If you'd like to contribute to `auto-readme-creator`, please follow these steps:

1. **Submit Issues**: Report bugs or request features by opening an issue on [GitHub Issues](https://github.com/MehekFatima/auto-readme-creator).

2. **Create Pull Requests**: Submit changes by creating a pull request. Please ensure your changes are well-documented and include tests if applicable.

We appreciate your interest and contributions to improving `auto-readme-creator`!
