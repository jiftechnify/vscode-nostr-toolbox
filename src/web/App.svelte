<script lang="ts">
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { bytesToHex } from "@noble/hashes/utils";
import { getVscode } from "./getVscode";

// const vscode = getVscode<string>();

let publicKey = "";
let secretKey = "";

const handleClickGenerate = () => {
	const skBytes = generateSecretKey();
	secretKey = bytesToHex(skBytes);
	publicKey = getPublicKey(skBytes);
};
const handleClickCopySeckey = () => {
	navigator.clipboard.writeText(secretKey);
};
const handleClickCopyPubkey = () => {
	navigator.clipboard.writeText(publicKey);
};

window.addEventListener("message", (event) => {
	const message = event.data;
	switch (message.type) {
		case "generateKeyPair":
			handleClickGenerate();
			break;
		default:
			console.log("unknown message:", message);
	}
});
</script>

<main>
  <button class="btn-generate" on:click={handleClickGenerate}
    >Generate Key Pair</button
  >
  <div class="container-key-pair">
    <div class="container-key">
      <label for="secret-key" class="label-key">Secret Key</label>
      <div class="row-key">
        <input
          id="secret-key"
          class="input-key"
          type="password"
          readonly
          value={secretKey}
        />
        <button class="btn-copy" on:click={handleClickCopySeckey}>
          <i class="codicon codicon-files"></i>
        </button>
      </div>
    </div>
    <div class="container-key">
      <label for="public-key" class="label-key">Public Key</label>
      <div class="row-key">
        <input
          id="public-key"
          class="input-key"
          type="text"
          readonly
          value={publicKey}
        />
        <button class="btn-copy" on:click={handleClickCopyPubkey}>
          <i class="codicon codicon-files"></i>
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-width: 100px;
    height: fit-content;
    margin: 2rem 0.5rem;
  }
  .btn-generate {
    width: 100%;
    border-radius: 2px;
  }
  .container-key-pair {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  .container-key {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .row-key {
    display: flex;
    gap: 0.5rem;
  }
  .input-key {
    flex-grow: 1;
  }
  .btn-copy {
    flex-grow: 0;
    width: 4rem;
    border-radius: 2px;
  }
</style>
