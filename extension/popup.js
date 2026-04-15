import { executeOnServer } from './server-handler.js';

document.addEventListener('DOMContentLoaded', async () => {
  const codeTextarea = document.getElementById('code');
  const packagesInput = document.getElementById('packages');
  const runBtn = document.getElementById('runBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const outputDiv = document.getElementById('output');
  const packagesGroup = document.getElementById('packagesGroup');

  // Load saved preferences
  chrome.storage.local.get(['code', 'packages'], (data) => {
    if (data.code) codeTextarea.value = data.code;
    if (data.packages) packagesInput.value = data.packages;
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

  // Handle copy button
  copyBtn.addEventListener('click', async () => {
    const text = outputDiv.textContent;
    if (text && text !== 'Output will appear here...') {
      await navigator.clipboard.writeText(text);
      const originalSvg = copyBtn.innerHTML;
      copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success)"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(() => {
        copyBtn.innerHTML = originalSvg;
      }, 2000);
    }
  });

  function updateUI() {
    packagesGroup.style.display = 'flex';
  }

  runBtn.addEventListener('click', async () => {
    const code = codeTextarea.value;
    const packages = packagesInput.value;

    const originalContent = runBtn.innerHTML;
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="loading">Running...</span>';
    outputDiv.textContent = 'Executing on Bun server...';
    outputDiv.classList.add('loading');
    
    try {
      // Always use bun runtime
      const result = await executeOnServer(code, packages, 'bun');

      const output = (result.stdout || '') + (result.stderr || '');
      outputDiv.textContent = output || (result.success ? '(Success, no output)' : 'Unknown error');
      
      if (!result.success && !output) {
        outputDiv.textContent = 'Execution failed. Ensure local Bun server is running at http://localhost:3006';
      }
    } catch (err) {
      outputDiv.textContent = 'Error: ' + err.message + '\n\nMake sure your local Bun server is running:\ncd server && bun run server.ts';
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = originalContent;
      outputDiv.classList.remove('loading');
      // Auto-scroll
      const terminal = outputDiv.parentElement;
      terminal.scrollTop = terminal.scrollHeight;
    }
  });
});
