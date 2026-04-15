// WebContainer Handler
// This uses the @webcontainer/api to run Node.js code in the browser.

let webcontainerInstance = null;

async function bootWebContainer() {
  if (webcontainerInstance) return webcontainerInstance;
  
  try {
    const { WebContainer } = await import('./webcontainer-api.js');
    webcontainerInstance = await WebContainer.boot();
    return webcontainerInstance;
  } catch (err) {
    console.error("Failed to boot WebContainer:", err);
    throw new Error("WebContainer boot failed. Check if your browser supports SharedArrayBuffer and Cross-Origin isolation.");
  }
}

export async function executeInWebContainer(code, packages = "") {
  try {
    const instance = await bootWebContainer();
    
    // Prepare files
    const files = {
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
    };

    await instance.mount(files);

    let stdout = '';
    let stderr = '';

    // 1. Install packages if requested
    if (packages && packages.trim().length > 0) {
      const packageList = packages.split(' ').filter(p => p.trim() !== '');
      if (packageList.length > 0) {
        const installProcess = await instance.spawn('npm', ['install', ...packageList]);
        
        installProcess.output.pipeTo(new WritableStream({
          write(data) { stdout += data; }
        }));

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          return { success: false, stdout, stderr: "Package installation failed." };
        }
        stdout = ''; // Clear install output to show only code output
      }
    }

    // 2. Run the code
    const process = await instance.spawn('node', ['index.js']);
    
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
