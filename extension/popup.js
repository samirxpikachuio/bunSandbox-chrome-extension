const API_URL = 'http://localhost:3006';

document.addEventListener('DOMContentLoaded', () => {
  const codeEditor = document.getElementById('code-editor');
  const packagesInput = document.getElementById('packages-input');
  const runBtn = document.getElementById('run-btn');
  const clearBtn = document.getElementById('clear-btn');
  const consoleOutput = document.getElementById('console-output');
  const statusIndicator = document.getElementById('status-indicator');

  // Basic indentation support for textarea
  codeEditor.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    }
  });

  // Load saved preferences
  chrome.storage.local.get(['code', 'packages'], (data) => {
    if (data.code) codeEditor.value = data.code;
    if (data.packages) packagesInput.value = data.packages;
  });

  // Save preferences on input
  codeEditor.addEventListener('input', () => {
    chrome.storage.local.set({ code: codeEditor.value });
  });

  packagesInput.addEventListener('input', () => {
    chrome.storage.local.set({ packages: packagesInput.value });
  });

  // Check server status on load
  checkServerStatus();

  async function checkServerStatus() {
    try {
      const response = await fetch(`${API_URL}/run`, { method: 'OPTIONS' });
      if (response.ok) {
        statusIndicator.textContent = '● Online';
        statusIndicator.classList.add('online');
      }
    } catch (e) {
      statusIndicator.textContent = '● Offline';
      statusIndicator.classList.remove('online');
    }
  }

  function appendToConsole(text, type = 'normal') {
    const span = document.createElement('span');
    span.textContent = text;
    if (type === 'error') {
      span.classList.add('error-text');
    } else if (type === 'success') {
      span.classList.add('success-text');
    }
    span.appendChild(document.createElement('br'));
    consoleOutput.appendChild(span);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  clearBtn.addEventListener('click', () => {
    consoleOutput.innerHTML = '';
  });

  runBtn.addEventListener('click', async () => {
    const code = codeEditor.value;
    const packages = packagesInput.value;

    if (!code.trim()) return;

    // Reset UI
    consoleOutput.innerHTML = '';
    const span = document.createElement('span');
    span.innerHTML = `<span class="loading">Running code and resolving dependencies...</span>`;
    span.classList.add('muted');
    consoleOutput.appendChild(span);

    runBtn.disabled = true;
    runBtn.style.opacity = '0.7';

    try {
      const response = await fetch(`${API_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, packages })
      });

      consoleOutput.innerHTML = ''; // clear loading state

      if (!response.ok) {
        const errorData = await response.json();
        appendToConsole(`Error: ${errorData.error}`, 'error');
        return;
      }

      const result = await response.json();
      
      if (result.stdout) {
        appendToConsole(result.stdout);
      }
      
      if (result.stderr) {
        appendToConsole(result.stderr, 'error');
      }

      if (result.success) {
        appendToConsole('[Process exited successfully]', 'success');
      } else {
        appendToConsole('[Process exited with errors]', 'error');
      }
    } catch (err) {
      consoleOutput.innerHTML = '';
      appendToConsole(`Connection Error: Ensure your local Bun server is running at ${API_URL}.\nRun 'bun run server.ts' in the server directory.`, 'error');
    } finally {
      runBtn.disabled = false;
      runBtn.style.opacity = '1';
    }
  });
});
