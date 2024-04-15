<script lang="ts">
  // import {} from 'vscode-webview'
  import {generateSecretKey, getPublicKey} from 'nostr-tools'
  import {bytesToHex, hexToBytes} from '@noble/hashes/utils'

  // const vscode = acquireVsCodeApi();
  // vscode.postMessage({ type: "ready" });

  let publicKey = "";
  let secretKey = "";

  $: {
    try {
      const skBytes = hexToBytes(secretKey);
      publicKey = getPublicKey(skBytes);
    } catch (e) {
      console.error("failed to get keypair:", e)
      publicKey = "";
    }
  }
  const handleClickGenerate = () => {
    const skBytes = generateSecretKey();
    secretKey = bytesToHex(skBytes);
    publicKey = getPublicKey(skBytes);
  }
  const handleClickCopySeckey = () => {
    navigator.clipboard.writeText(secretKey);
  }
  const handleClickCopyPubkey = () => {
    navigator.clipboard.writeText(publicKey);
  }
</script>

<main>
  <button class="btn-generate" on:click={handleClickGenerate}>Generate Keypair</button>
  <div class="container-keypair">
    <div class="container-key">
      <label for="secret-key" class="label-key">Secret Key:</label>
      <div class="row-key">
        <input id="secret-key" class="input-key" type="password" bind:value={secretKey} />
        <button class="btn-copy" on:click={handleClickCopySeckey}>Copy</button>
      </div>
    </div>
    <div class="container-key">
      <label for="public-key" class="label-key">Public Key:</label>
      <div class="row-key">
        <input id="public-key" class="input-key" type="text" readonly value={publicKey}/>
        <button class="btn-copy" on:click={handleClickCopyPubkey}>Copy</button>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    width: 80%;
    min-width: 300px;
    margin: auto;
  }
  .btn-generate {
    width: 100%;
  }
  .container-keypair {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
  }
  .container-key {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .label-key {
    font-weight: bold;
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
  }
</style>
