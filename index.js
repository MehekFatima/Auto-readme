#!/usr/bin/env node

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

// Function to extract comments based on file type
const extractComments = (code, fileType) => {
  let comments = [];

  if (['js', 'jsx', 'ts'].includes(fileType)) {
    // Parse JavaScript/TypeScript code with Babel
    const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    comments = ast.comments || [];
    return comments.map(comment => comment.value.trim());
  } else if (fileType === 'py') {
    // Extract Python comments (lines starting with #)
    const regex = /#(.*)/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
      comments.push(match[1].trim());
    }
  } else if (fileType === 'css' || fileType === 'html') {
    // Extract CSS/HTML comments (/* ... */ for CSS and <!-- ... --> for HTML)
    const regex = fileType === 'css' ? /\/\*([\s\S]*?)\*\//g : /<!--([\s\S]*?)-->/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
      comments.push(match[1].trim());
    }
  } else if (fileType === 'java') {
    // Extract Java comments (// ... and /* ... */)
    const regex = /\/\/(.*)|\/\*([\s\S]*?)\*\//g;
    let match;
    while ((match = regex.exec(code)) !== null) {
      comments.push((match[1] || match[2]).trim());
    }
  }

  return comments;
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
  const watcher = chokidar.watch('./**/*.{js,jsx,ts,py,css,html,java}', {
    ignored: /node_modules/,
    persistent: true
  });

  watcher.on('change', (filePath) => {
    console.log(`File ${filePath} has been changed. Generating README...`);
    const code = fs.readFileSync(filePath, 'utf-8');
    const fileType = path.extname(filePath).slice(1); // Get the file extension
    const comments = extractComments(code, fileType);
    const markdown = generateMarkdown(comments, path.basename(filePath));
    fs.writeFileSync('README.md', markdown);
    console.log('README.md has been updated.');
  });

  console.log('Watching for file changes...');
};

watchFiles();