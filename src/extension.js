const vscode = require('vscode');
const callChatGPT = require('./chatgpt');
const diagnosticCollection = vscode.languages.createDiagnosticCollection('chatgpt-code-analyzer');

const path = require('path');
const fs = require('fs');



async function analyzeSecurity() {
  try {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('Please open a file to analyze.');
      return;
    }

    const text = editor.document.getText();
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Analyzing file for security vulnerabilities',
        cancellable: false,
      },
      async () => {
        try {
          await analyzeAndApplyDiagnostics(editor.document.uri.fsPath, text);
        }
        catch (error) {
          console.error(error);
          vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
      }
    );
  } catch(error) {
    console.error(error);

  }
}

async function analyzeWorkspace() {
  const workspaceFolder = vscode.workspace.workspaceFolders[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder to analyze.');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Analyzing workspace for security vulnerabilities',
      cancellable: false,
    },
    async () => {
      await analyzeDirectory(workspaceFolder.uri.fsPath);
    }
  );
}

async function analyzeDirectory(directoryPath) {
  let dirEntries = fs.readdirSync(directoryPath, { withFileTypes: true });

  const ignoreFiles = ['LICENSE', '.gitignore', 'README.md']; // Add other files you want to ignore

  for (const entry of dirEntries) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      await analyzeDirectory(entryPath);
    } else if (entry.isFile() && !ignoreFiles.includes(entry.name)) {
      // Analyze all file types except those in the ignoreFiles array
      const text = fs.readFileSync(entryPath, 'utf8');
      await analyzeAndApplyDiagnostics(entryPath, text);
    }
  }
}

async function analyzeAndApplyDiagnostics(filePath, text) {
  try {
    const result = await callChatGPT(text);
    openaiKey = 'asdasdaAAAXX233easas';
    // Parse the result and create diagnostics
    const diagnostics = [];
    const regex = /Line (\d+): (.+)/g;
    let match;
    while ((match = regex.exec(result)) !== null) {
      const lineNumber = parseInt(match[1], 10) - 1; // convert to 0-based index
      const message = match[2];

      // Calculate the range using the line number
      const startPos = new vscode.Position(lineNumber, 0);
      const endPos = new vscode.Position(lineNumber, text.split('\n')[lineNumber].length);
      const range = new vscode.Range(startPos, endPos);

      const diagnostic = new vscode.Diagnostic(
        range,
        message,
        vscode.DiagnosticSeverity.Warning
      );
      diagnostics.push(diagnostic);
    }

    // Show the diagnostics in the editor
    const fileUri = vscode.Uri.file(filePath);
    diagnosticCollection.set(fileUri, diagnostics);
  } catch (error) {
    console.error(`Error analyzing ${filePath}: ${error.message}`);
  }
}

async function promptForApiKey() {
  const apiKey = await vscode.window.showInputBox({
    placeHolder: 'Enter your ChatGPT API key',
    prompt: 'Enter your ChatGPT API key to use the ChatGPT Code Analyzer',
    password: true
  });

  if (apiKey) {
    await vscode.workspace.getConfiguration().update('chatgpt-code-analyzer.apiKey', apiKey, vscode.ConfigurationTarget.Global);
  } else {
    vscode.window.showWarningMessage('No API key provided, the extension will not work correctly without an API key.');
  }
}

function activate(context) {
  let apiKey = vscode.workspace.getConfiguration().get('chatgpt-code-analyzer.apiKey');
  if (!apiKey || apiKey.trim() === "") {
    promptForApiKey();
  }
  // Register analyzeSecurity command
  const analyzeSecurityDisposable = vscode.commands.registerCommand(
    'extension.analyzeSecurity',
    analyzeSecurity
  );

  // Register analyzeWorkspace command
  const analyzeWorkspaceDisposable = vscode.commands.registerCommand(
    'extension.analyzeWorkspace',
    analyzeWorkspace
  );
  context.subscriptions.push(analyzeSecurityDisposable, analyzeWorkspaceDisposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
