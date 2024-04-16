import type { WebviewApi } from "vscode-webview";

export const getVscode = <StateType = undefined>() => {
	return vscode as WebviewApi<StateType>;
};
