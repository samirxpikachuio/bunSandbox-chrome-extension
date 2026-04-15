# Sandbox 🚀: High-Performance Bun Sandbox for Chrome

![Logo](extension/icons/icon.png)

A high-performance Chrome extension and local server environment designed for rapid testing, prototyping, and execution of Bun and TypeScript code directly from your browser's side panel.

## 🌟 Key Features

- **Blazing Fast Bun Execution**: Harness the full power of the Bun runtime for near-instant execution.
- **On-the-fly Package Support**: Install any NPM package dynamically just by listing them in the packages field.
- **Side Panel Integration**: A sleek, premium developer interface that stays open while you browse.
- **Persistent Workspace**: Your code and packages are automatically saved to your browser's local storage.
- **Real-time Terminal Output**: A clean, readable terminal interface with copy-to-clipboard functionality.

## 🚀 Quick Start

### 1. Install the Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `extension` directory within this project.
5. Open the Side Panel (click the extension icon).

### 2. Set Up the Bun Server
To execute code, you must have the local server running:
```bash
cd server
bun install
bun run server.ts
```
The server will start on `http://localhost:3006`.

## 📂 Project Structure

- `extension/`: The Chrome extension source code.
  - `manifest.json`: Configuration for the Chrome environment.
  - `popup.html/js`: The core sandbox UI and logic.
  - `server-handler.js`: Handles communication with the Bun server.
- `server/`: The Bun-powered execution environment.
  - `server.ts`: The HTTP server that manages temporary execution directories and package installation.
  - `Dockerfile`: For containerized deployment of the execution server.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, Modern JavaScript.
- **Runtime**: [Bun](https://bun.sh) (Local).
- **Communication**: Fetch API for secure `localhost` communication.

## 🔒 Security & Privacy

- Your code is executed locally on your own machine.
- No data ever leaves your computer; the extension only communicates with `localhost:3006`.
- Package installations happen in temporary directories that are automatically cleaned up.

---

Built for speed and developer productivity.
