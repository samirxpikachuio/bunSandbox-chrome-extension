import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Bun.serve({
  port: process.env.PORT || 3006,
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(req.url);
    if (req.method === "POST" && (url.pathname === "/execute" || url.pathname === "/run")) {
      try {
        const { code, packages } = await req.json();
        const output = await executeBunEnvironment(code, packages);
        return new Response(JSON.stringify(output), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      } catch (e: any) {
        return new Response(
          JSON.stringify({ error: e.message || "Failed to execute" }),
          { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response("Not found", { status: 404, headers: CORS_HEADERS });
  },
});

async function executeBunEnvironment(code: string, packages: string) {
  // Create temp dir
  const prefix = join(tmpdir(), "bun-sandbox-");
  const workDir = await mkdtemp(prefix);

  try {
    // 1. Install packages if requested
    if (packages && packages.trim().length > 0) {
      const packageList = packages.split(' ').filter(p => p.trim() !== '');
      if (packageList.length > 0) {
        console.log(`[Bun] Installing: ${packageList.join(', ')}`);
        const installProc = Bun.spawn(["bun", "add", ...packageList], {
          cwd: workDir,
        });
        await installProc.exited;
      }
    }

    // 2. Write code to file
    const codeFile = join(workDir, "index.ts");
    await writeFile(codeFile, code);

    // 3. Execute code
    console.log(`[Bun] Running script...`);
    const runProc = Bun.spawn(["bun", "run", "index.ts"], {
      cwd: workDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    await runProc.exited;
    
    const stdout = await new Response(runProc.stdout).text();
    const stderr = await new Response(runProc.stderr).text();

    return {
      success: true,
      stdout,
      stderr,
    };
  } catch (err: any) {
    return {
      success: false,
      stdout: "",
      stderr: err.message,
    };
  } finally {
    // Clean up
    setTimeout(async () => {
      try {
        await rm(workDir, { recursive: true, force: true });
      } catch {}
    }, 2000);
  }
}

console.log("Bun-only Sandbox Server running on http://localhost:3006");
