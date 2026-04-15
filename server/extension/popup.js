import { executeInWebContainer } from './webcontainer-handler.js';
import { executeOnServer } from './server-handler.js';

document.addEventListener('DOMContentLoaded', async () => {
  const modeSelect = document.getElementById('mode');
  const runtimeSelect = document.getElementById('runtime');
  const codeTextarea = document.getElementById('code');
  const packagesInput = document.getElementById('packages');
  const runBtn = document.getElementById('runBtn');
  const clearBtn = document.getElementById('clearBtn');
  const outputDiv = document.getElementById('output');
  const packagesGroup = document.getElementById('packagesGroup');

  // Load saved preferences
  chrome.storage.local.get(['mode', 'runtime', 'code', 'packages'], (data) => {
    if (data.mode) modeSelect.value = data.mode;
    if (data.runtime) runtimeSelect.value = data.runtime;
    if (data.code) codeTextarea.value = data.code;
    if (data.packages) packagesInput.value = data.packages;
    updateUI();
  });

  // Handle mode changes
  modeSelect.addEventListener('change', () => {
    chrome.storage.local.set({ mode: modeSelect.value });
    updateUI();
  });

  // Handle runtime changes
  runtimeSelect.addEventListener('change', () => {
    chrome.storage.local.set({ runtime: runtimeSelect.value });
    updateUI();
  });

  // Handle code changes
  codeTextarea.addEventListener('input', () => {
    chrome.storage.local.set({ code: codeTextarea.value });
  });

  // Handle packages changes
  packagesInput.addEventListener('input', () => {
    chrome.storage.local.set({ packages: packagesInput.value });
  });

  // Handle clear button
  clearBtn.addEventListener('click', () => {
    outputDiv.textContent = 'Output cleared.';
  });

  function updateUI() {
    const isServer = modeSelect.value === 'server';
    const isBun = runtimeSelect.value === 'bun';
    
    // Show packages input only for Server-Based Bun for now
    packagesGroup.style.display = (isServer && isBun) ? 'block' : 'none';
  }

  runBtn.addEventListener('click', async () => {
    const mode = modeSelect.value;
    const runtime = runtimeSelect.value;
    const code = codeTextarea.value;
    const packages = packagesInput.value;

    outputDiv.textContent = 'Executing...';
    if (packages && mode === 'server') {
      outputDiv.textContent += '\n(This may take a moment to install packages: ' + packages + ')';
    }
    runBtn.disabled = true;

    try {
      let result;
      if (mode === 'autonomous') {
        if (runtime === 'node') {
          result = await executeInWebContainer(code);
        } else {
          outputDiv.textContent = 'Autonomous Bun is currently experimental. Switching to Server-Based...';
          result = await executeOnServer(code, packages);
        }
      } else {
        result = await executeOnServer(code, packages);
      }

      const output = (result.stdout || '') + (result.stderr || '');
      outputDiv.textContent = output || (result.success ? '(Success, no output)' : 'Unknown error');
      if (!result.success && !output) {
        outputDiv.textContent = 'Execution failed.';
      }
    } catch (err) {
      outputDiv.textContent = 'Error: ' + err.message;
    } finally {
      runBtn.disabled = false;
    }
  });
});
