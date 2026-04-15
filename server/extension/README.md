# Bun & Node.js Sandbox Extension

This extension allows you to run Node.js and Bun code in two modes:

## 1. Autonomous Mode (WebContainers)
- **Runtime**: Node.js (Default).
- **How it works**: Uses the `@webcontainer/api` to run a full Node.js environment in your browser via WebAssembly.
- **Benefits**: 100% offline, no backend required.
- **Note**: Requires a browser that supports `SharedArrayBuffer` and Cross-Origin isolation.

## 2. Server-Based Mode
- **Runtime**: Bun.
- **How it works**: Sends code to a local Bun server (running on `localhost:3006`).
- **Benefits**: Fast execution, full access to the Bun runtime.

## Installation
1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `extension` directory.

## Running the Server
To use the Bun mode, make sure the local server is running:
```bash
bun run server.ts
```

## Features
- Persistence: Your code and mode selection are saved automatically.
- Dual Runtimes: Toggle between Node.js and Bun.
- Console Output: Real-time feedback from your code.
