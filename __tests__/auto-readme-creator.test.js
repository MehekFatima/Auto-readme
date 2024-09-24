// __tests__/auto-readme-creator.test.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testFilePath = path.join(__dirname, 'test-file.js');
const readmePath = path.join(__dirname, 'README.md');

// Helper function to create a test file with specific content
const createTestFile = (content) => {
  fs.writeFileSync(testFilePath, content);
};

// Helper function to clean up test files
const cleanup = () => {
  if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  if (fs.existsSync(readmePath)) fs.unlinkSync(readmePath);
};

beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

test('generates README.md with correct headings and paragraphs', () => {
  const fileContent = `
// Initialization
// ~ This function sets up the application environment
// ~ It includes loading configurations and initializing services

// User Input Handling
// ~ This section processes user inputs
// ~ It validates and formats inputs before they are used
`;

  createTestFile(fileContent);

  // Run the auto-readme-creator script
  execSync('node ./index.js', { stdio: 'inherit' });

  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  expect(readmeContent).toContain('# test-file');
  expect(readmeContent).toContain('## Initialization');
  expect(readmeContent).toContain('This function sets up the application environment');
  expect(readmeContent).toContain('It includes loading configurations and initializing services');
  expect(readmeContent).toContain('## User Input Handling');
  expect(readmeContent).toContain('This section processes user inputs');
  expect(readmeContent).toContain('It validates and formats inputs before they are used');
});

test('updates README.md when file content changes without duplicating', () => {
  // Initial content of the file
  const initialContent = `
// Initialization
// ~ This function sets up the application environment
`;

  createTestFile(initialContent);

  // Run the auto-readme-creator script initially
  execSync('node ./index.js', { stdio: 'inherit' });

  let readmeContent = fs.readFileSync(readmePath, 'utf-8');

  // Ensure the initial README content is correct
  expect(readmeContent).toContain('# test-file');
  expect(readmeContent).toContain('## Initialization');
  expect(readmeContent).toContain('This function sets up the application environment');

  // Modify the file content to simulate a file change
  const updatedContent = `
// Initialization
// ~ This function sets up the application environment
// ~ It includes loading configurations

// User Input Handling
// ~ This section handles user inputs
`;

  createTestFile(updatedContent);

  // Re-run the auto-readme-creator script after file change
  execSync('node ./index.js', { stdio: 'inherit' });

  readmeContent = fs.readFileSync(readmePath, 'utf-8');

  // Ensure the old content is replaced, and new content is added without duplication
  expect(readmeContent).toContain('It includes loading configurations');
  expect(readmeContent).toContain('## User Input Handling');
  expect(readmeContent).toContain('This section handles user inputs');

  // Check that duplicate sections do not exist
  const initHeadingMatches = (readmeContent.match(/## Initialization/g) || []).length;
  expect(initHeadingMatches).toBe(1);

  const userHandlingMatches = (readmeContent.match(/## User Input Handling/g) || []).length;
  expect(userHandlingMatches).toBe(1);
});
