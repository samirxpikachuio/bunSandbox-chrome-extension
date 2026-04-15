# Sandbox Chrome Extension 🚀

This extension provides a high-performance environment to run Bun and TypeScript code directly from your browser's side panel.

## Implementation Details

### Execution Flow
1. **User Input**: The user enters code and (optionally) NPM packages in the side panel.
2. **Persistence**: Data is saved to `chrome.storage.local`.
3. **Request**: The code and package list are sent via a POST request to `http://localhost:3006/execute`.
4. **Execution**:
    - The local Bun server creates a temporary directory.
    - It installs requested packages using `bun add`.
    - It writes the code to an `index.ts` file.
    - It executes the file using `bun run`.
5. **Feedback**: `stdout` and `stderr` are returned and displayed in the virtual terminal.

## Installation
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this directory.
4. Pin the extension for quick access.

## Requirements
To use this extension, you must have the **Bun Sandbox Server** running locally.
```bash
# From the project root
cd server
bun run server.ts
```

## Security
This extension only communicates with `http://localhost:3006`. No telemetry or user code is sent to external servers.
