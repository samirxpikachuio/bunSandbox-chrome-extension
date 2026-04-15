// WebContainer Handler
// This uses the @webcontainer/api to run Node.js code in the browser.

let webcontainerInstance = null;

async function bootWebContainer() {
  if (webcontainerInstance) return webcontainerInstance;
  
  // Note: In a real extension, you would import this from a bundled file or a specific CDN.
  // For this demo, we assume @webcontainer/api is available globally or via dynamic import.
  try {
    const { WebContainer } = await import('https://unpkg.com/@webcontainer/api?module');
    webcontainerInstance = await WebContainer.boot();
    return webcontainerInstance;
  } catch (err) {
    console.error("Failed to boot WebContainer:", err);
    throw new Error("WebContainer boot failed. Check if your browser supports SharedArrayBuffer and Cross-Origin isolation.");
  }
}

export async function executeInWebContainer(code) {
  try {
    const instance = await bootWebContainer();
    
    // Write the code to index.js
    await instance.mount({
      'index.js': {
        file: {
          contents: code,
        },
      },
      'package.json': {
        file: {
          contents: JSON.stringify({
            name: 'sandbox',
            type: 'module',
            dependencies: {}
          })
        }
      }
    });

    // Run the code
    const process = await instance.spawn('node', ['index.js']);
    
    let stdout = '';
    let stderr = '';

    process.output.pipeTo(new WritableStream({
      write(data) {
        stdout += data;
      }
    }));

    // Wait for the process to exit
    const exitCode = await process.exit;
    
    return {
      success: exitCode === 0,
      stdout: stdout,
      stderr: stderr
    };
  } catch (error) {
    return {
      success: false,
      stderr: error.message,
      stdout: ""
    };
  }
}
