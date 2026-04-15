```markdown
# Bun Sandbox for Chrome

![Logo](extension/icons/icon.png)

**Bun Sandbox** is a high-performance Chrome extension paired with a local Bun runtime server. It enables developers to rapidly test, prototype, and execute Bun and TypeScript code directly from the browser’s side panel — with full NPM package support and real-time terminal output.

## Key Features

- **High-Performance Bun Runtime**: Execute code with near-instant startup and native performance using the Bun runtime.
- **Dynamic NPM Package Support**: Install any package on-the-fly by simply listing it in the packages field — no manual configuration required.
- **Integrated Side Panel UI**: A clean, professional developer interface that stays open alongside your browsing session.
- **Persistent Workspace**: Code, packages, and settings are automatically saved to browser local storage.
- **Real-Time Terminal Output**: Live console with syntax highlighting, timestamps, and one-click copy functionality.

## Prerequisites

Before getting started, ensure you have the following:

- Google Chrome (version 120 or later recommended)
- Bun runtime installed globally on your machine (`bun --version` should return a version number)
- The project cloned or downloaded to your local machine

## Getting Started

Follow these steps in order to set up and run the sandbox.

### Step 1: Install the Chrome Extension

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Toggle **Developer mode** on (top-right corner).
4. Click **Load unpacked**.
5. Select the `extension` folder located in the root of this project.
6. The extension will appear in your list. Pin the extension icon to the toolbar for quick access.
7. Click the extension icon to open the **Side Panel**.

### Step 2: Start the Local Bun Server

The extension communicates with a local Bun server to execute code securely. The server must be running.

1. Open a terminal window.
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the server:
   ```bash
   bun run server.ts
   ```

The server will start on `http://localhost:3006`. Keep this terminal window open while using the sandboxOR HOST on railway 

### Step 3: Verify Connection

Once both the extension and server are running:
- The side panel should display a “Connected” status.
- You are now ready to write and execute code.

## Usage Guide

### Step 1: Write Your Code
- In the side panel editor, write your Bun or TypeScript code.
- The editor supports modern JavaScript/TypeScript syntax with basic auto-formatting.

### Step 2: Add Packages (Optional)
- In the **Packages** field, enter a comma-separated list of NPM package names (e.g., `lodash, date-fns`).
- The server will automatically install them in a temporary environment on first execution.

### Step 3: Execute Code
- Click the **Run** button (or use the keyboard shortcut shown in the UI).
- Execution happens instantly on the local Bun server.

### Step 4: View Results
- Real-time output appears in the integrated terminal below the editor.
- Use the copy button to copy any output or logs.
- Errors are highlighted for quick debugging.

### Step 5: Workspace Management
- Your code and package list are automatically saved.
- Refreshing the side panel or restarting Chrome will restore your last session.
- To reset the workspace, use the **Clear Workspace** option in the side panel menu.

## Project Structure

```
.
├── extension/              # Chrome extension source code
│   ├── manifest.json       # Extension configuration
│   ├── popup.html          # Side panel UI
│   ├── popup.js            # Core logic and UI interactions
│   └── server-handler.js   # Communication with the local server
├── server/                 # Bun execution environment
│   ├── server.ts           # HTTP server and execution engine
│   ├── Dockerfile          # Optional containerized deployment
│   └── package.json
└── README.md
```

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, and modern JavaScript (ES modules)
- **Runtime**: Bun (high-performance JavaScript/TypeScript runtime)
- **Communication**: Secure Fetch API over localhost only
- **Storage**: Browser Local Storage for persistence

## Security & Privacy

- All code execution occurs **locally** on your machine.
- The extension communicates **exclusively** with `http://localhost:3006`.
- No data is sent to external servers.
- Packages are installed in isolated temporary directories that are automatically cleaned up after execution.
