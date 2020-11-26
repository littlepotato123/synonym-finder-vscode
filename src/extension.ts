// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import fetch from 'node-fetch';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "synonym-finder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		'synonym-finder.helloWorld', 
		async () => {
			const editor = vscode.window.activeTextEditor;
			if(!editor) {
				vscode.window.showInformationMessage("Editor Does not Exist");
				return;
			}

			const text = editor.document.getText(editor.selection);
			const response = await fetch(`https://api.datamuse.com/words?ml=${text.replace(' ', '+')}`);
			const data = await response.json();
			const quickPick = vscode.window.createQuickPick();
			quickPick.items = data.map((x: any) => ({ label: x.word }));
			quickPick.onDidChangeSelection(([item]) => {
				if(item) {
					vscode.window.showInformationMessage(item.label);
					editor.edit((edit) => {
						edit.replace(editor.selection, item.label);
					})
					quickPick.dispose();
				}
			});
			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();
		}
	);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
