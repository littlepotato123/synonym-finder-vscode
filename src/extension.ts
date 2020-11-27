import fetch from 'node-fetch';
import * as vscode from 'vscode';

export const activate = (context: vscode.ExtensionContext) => {
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

export const deactivate = () => {};