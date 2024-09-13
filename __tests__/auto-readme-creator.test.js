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
