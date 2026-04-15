import { executeInWebContainer } from './webcontainer-handler.js';
import { executeOnServer } from './server-handler.js';

document.addEventListener('DOMContentLoaded', async () => {
  const modeSelect = document.getElementById('mode');
  const runtimeSelect = document.getElementById('runtime');
  const codeTextarea = document.getElementById('code');
  const runBtn = document.getElementById('runBtn');
  const outputDiv = document.getElementById('output');

  // Load saved preferences
  chrome.storage.local.get(['mode', 'runtime', 'code'], (data) => {
    if (data.mode) modeSelect.value = data.mode;
    if (data.runtime) runtimeSelect.value = data.runtime;
    if (data.code) codeTextarea.value = data.code;
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
  });

  // Handle code changes
  codeTextarea.addEventListener('input', () => {
    chrome.storage.local.set({ code: codeTextarea.value });
  });

  function updateUI() {
    const isAutonomous = modeSelect.value === 'autonomous';
    
    // In autonomous mode, we currently only support Node.js (WebContainers)
    if (isAutonomous) {
      // If user chooses Autonomous, force Node.js for now or warn about Bun.
      if (runtimeSelect.value === 'bun') {
        // We might want to switch to Node automatically if Bun isn't available in Autonomous mode.
        // For now, let's just let it fail or provide a message.
      }
    }
  }

  runBtn.addEventListener('click', async () => {
    const mode = modeSelect.value;
    const runtime = runtimeSelect.value;
    const code = codeTextarea.value;

    outputDiv.textContent = 'Executing...';
    runBtn.disabled = true;

    try {
      let result;
      if (mode === 'autonomous') {
        if (runtime === 'node') {
          result = await executeInWebContainer(code);
        } else {
          outputDiv.textContent = 'Autonomous Bun is currently experimental. Switching to Server-Based...';
          result = await executeOnServer(code);
        }
      } else {
        // Server-Based (Works for both Bun and Node, but mostly for Bun in this setup)
        result = await executeOnServer(code);
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
