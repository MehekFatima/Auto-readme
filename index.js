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
  // Extract the base name without extension for section title
  const baseName = path.basename(fileName, path.extname(fileName));

  let markdown = `# ${baseName}\n\n`;
  let currentHeading = null;

  comments.forEach(comment => {
    if (comment.startsWith('~')) {
      // Treat comments starting with ~ as paragraphs under the last heading
      if (currentHeading) {
        markdown += `${comment.substring(1).trim()}\n\n`;
      }
    } else {
      // Use comments without ~ as headings
      currentHeading = comment;
      markdown += `## ${currentHeading}\n\n`;
    }
  });

  if (!currentHeading) {
    markdown += `No comments found in ${fileName}.\n\n`;
  }

  return markdown;
};

// Function to update the README with content from each file
const updateReadme = (fileName, markdownContent) => {
  let readmeContent = '';

  // Check if README exists
  if (fs.existsSync('README.md')) {
    readmeContent = fs.readFileSync('README.md', 'utf-8');
  }

  const fileSection = `# ${path.basename(fileName, path.extname(fileName))}\n`;

  // Replace existing content for the file if it already exists
  if (readmeContent.includes(fileSection)) {
    const regex = new RegExp(`${fileSection}[\\s\\S]*?(?=# |$)`, 'g');
    readmeContent = readmeContent.replace(regex, markdownContent);
  } else {
    // Append new content
    readmeContent += markdownContent;
  }

  // Write the updated content back to README.md
  fs.writeFileSync('README.md', readmeContent);
  console.log(`README.md has been updated with changes from ${fileName}.`);
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
    updateReadme(path.basename(filePath), markdown);
  });

  console.log('Watching for file changes...');
};

watchFiles();