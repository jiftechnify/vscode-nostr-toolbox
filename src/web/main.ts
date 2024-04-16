import App from "./App.svelte";

const app = new App({
	// biome-ignore lint/style/noNonNullAssertion:
	target: document.getElementById("app")!,
});

export default app;
