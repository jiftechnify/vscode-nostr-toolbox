import type { WebviewApi } from "vscode-webview";

export const getVscode = <StateType>() => {
	return window.vscode as WebviewApi<StateType>;
};
