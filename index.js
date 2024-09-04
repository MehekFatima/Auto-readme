#!/usr/bin/env node

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

// Function to parse comments from the code
const extractComments = (code) => {
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  const comments = ast.comments || [];
  return comments.map(comment => comment.value.trim());
};

// Function to generate markdown from comments
const generateMarkdown = (comments, fileName) => {
  let markdown = `# ${fileName}\n\n`;
  comments.forEach((comment, index) => {
    markdown += `## Section ${index + 1}\n${comment}\n\n`;
  });
  return markdown;
};

// Function to watch files and generate README
const watchFiles = () => {
  const watcher = chokidar.watch('./src/**/*.js', {
    ignored: /node_modules/,
    persistent: true
  });

  watcher.on('change', (filePath) => {
    console.log(`File ${filePath} has been changed. Generating README...`);
    const code = fs.readFileSync(filePath, 'utf-8');
    const comments = extractComments(code);
    const markdown = generateMarkdown(comments, path.basename(filePath));
    fs.writeFileSync('README.md', markdown);
    console.log('README.md has been updated.');
  });

  console.log('Watching for file changes...');
};

watchFiles();
