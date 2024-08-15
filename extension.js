const vscode = require('vscode');

let defaultText = "One Thing";
let fullText = defaultText;
let statusBarItem;

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.editGoal', () => {
        vscode.window.showInputBox({
            prompt: 'Edit your focus goal',
            value: fullText
        }).then(value => {
            // If the input is empty, set to defaultText
            fullText = value && value.trim() !== "" ? value : defaultText;
            updateEditorTitle();
            context.globalState.update('goalText', fullText);
        });
    });

    context.subscriptions.push(disposable);

    let tooltipDisposable = vscode.commands.registerCommand('extension.showFullGoal', () => {
        vscode.window.showInformationMessage(fullText, { modal: false });
    });

    context.subscriptions.push(tooltipDisposable);

    fullText = context.globalState.get('goalText', defaultText);
    updateEditorTitle();

    vscode.window.onDidChangeActiveTextEditor(updateEditorTitle);
}

function updateEditorTitle() {
    if (!statusBarItem) {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        statusBarItem.command = 'extension.editGoal';
        statusBarItem.show();
    }

    const maxLength = 30;
    const truncatedText = fullText.length > maxLength ? `${fullText.slice(0, maxLength)}...` : fullText;
    statusBarItem.text = truncatedText;
}

function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
