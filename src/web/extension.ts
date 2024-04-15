// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nostr-toolbox" is now active in the web extension host!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('nostr-toolbox.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from nostr-toolbox in a web extension host!');
	});

	context.subscriptions.push(disposable);

	const provider = new NostrTBKeypairGeneratorViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(NostrTBKeypairGeneratorViewProvider.viewType, provider)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

class NostrTBKeypairGeneratorViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'nostrToolbox.keypairGenerator';

	private _view?: vscode.WebviewView;

		constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => console.log(data));
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'assets', 'index.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleIndexUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'assets', 'index.css'));
		// const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		// return `<!DOCTYPE html>
		// 	<html lang="en">
		// 	<head>
		// 		<meta charset="UTF-8">

		// 		<!--
		// 			Use a content security policy to only allow loading styles from our extension directory,
		// 			and only allow scripts that have a specific nonce.
		// 			(See the 'webview-sample' extension sample for img-src content security policy examples)
		// 		-->
		// 		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

		// 		<meta name="viewport" content="width=device-width, initial-scale=1.0">

				

		// 		<title>Nostr</title>
		// 	</head>
		// 	<body>
		// 		<p>Keypair Generator</p>
		// 		<button class="btn-generate">Generate</button>
		// 		<div>
		// 		<div>
		// 			<label for="public-key">Public Key:</label>
		// 			<div>
		// 				<input type="text" id="public-key" readonly>
		// 				<button>copy</button>
		// 			</div>
		// 		</div>
		// 		<div>
		// 			<label for="secret-key">Secret Key:</label>
		// 			<div>
		// 				<input type="password" id="secret-key" readonly>
		// 				<button>copy</button>
		// 			</div>
		// 		</div>
		// 		</div>
		// 	</body>
		// 	</html>`;
		return `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
					<link href="${styleResetUri}" rel="stylesheet">
					<link href="${styleVSCodeUri}" rel="stylesheet">
					<link href="${styleIndexUri}" rel="stylesheet">
					<title>Vite + Svelte + TS</title>
				</head>
				<body>
					<div id="app"></div>
					<script nonce="${nonce}" src="${scriptUri}">
						const vscode = acquireVsCodeApi();
					</script>
				</body>
			</html>`;
	}
}


function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
