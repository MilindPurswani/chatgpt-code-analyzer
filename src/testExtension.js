const vscode = require('vscode');

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    'extension.testExtension',
    () => {
      vscode.window.showInformationMessage('Test Extension is running!');
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
