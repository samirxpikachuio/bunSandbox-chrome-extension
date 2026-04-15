# Sandbox 🚀: High-Performance Bun & Node.js Environment

![Logo](extension/icons/icon.png)

A professional-grade Chrome extension and local server environment designed for rapid testing, prototyping, and execution of Node.js and Bun code directly from your browser.

## 🌟 Key Features

- **Dual Runtime Support**: Seamlessly toggle between **Node.js** (via WebContainers) and **Bun** (via local server).
- **Autonomous Mode**: Run Node.js directly in your browser using WebAssembly. 100% offline and secure.
- **Server-Based Execution**: Harness the full power of the Bun runtime for blazingly fast execution.
- **Persistent Workspace**: Your code, settings, and runtime selection are automatically saved.
- **Rich Console Interface**: Real-time logging and error reporting with high readability.
- **Modern UI**: A sleek, premium side-panel interface designed for developers.

## 🚀 Quick Start

### 1. Install the Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `extension` directory within this project.

### 2. Set Up the Bun Server (Optional)
To use the Bun runtime, ensure you have Bun installed and then start the handler:
```bash
bun run server.ts
```
The server will start on `http://localhost:3006`.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, Modern JavaScript.
- **Runtimes**:
  - **Node.js**: Powered by `@webcontainer/api`.
  - **Bun**: Local execution via a Bun-powered server.
- **Communication**: Fetch API for server-mode, WebAssembly for autonomous-mode.

## 📂 Project Structure

- `extension/`: The Chrome extension source code.
  - `icons/`: Branding assets.
  - `manifest.json`: Extension configuration.
  - `background.js`: Service worker logic.
  - `popup.html/js`: The core sandbox UI.
- `server/`: The local execution server for Bun mode.
- `README.md`: This file.

## 🔒 Security & Privacy

- **Autonomous Mode**: Code runs in a sandboxed WebContainer within your browser tab.
- **Server Mode**: Only communicates with `localhost`. No data ever leaves your machine.

---

Built with ❤️ by the Sandbox Team.
