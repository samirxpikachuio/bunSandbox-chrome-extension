import { mkdtemp, rm } from "node:fs/promises";
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
    if (req.method === "POST" && url.pathname === "/run") {
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
  const prefix = join(tmpdir(), "bun-sandbox-tmp-");
  const workDir = await mkdtemp(prefix);

  let outputText = "";
  let errorText = "";

  try {
    // 1. Install packages if requested
    if (packages && packages.trim().length > 0) {
      const packageList = packages.split(' ').filter(p => p.trim() !== '');
      if (packageList.length > 0) {
        console.log(`Installing packages in ${workDir}: ${packageList.join(', ')}`);
        const installProc = Bun.spawn(["bun", "add", ...packageList], {
          cwd: workDir,
          stdout: "pipe",
          stderr: "pipe",
        });
        const installResult = await installProc.exited;
        if (installResult !== 0) {
          const err = await new Response(installProc.stderr).text();
          throw new Error(`Package install failed: \n${err}`);
        }
      }
    }

    // 2. Write code to file
    const codeFile = join(workDir, "index.ts");
    await Bun.write(codeFile, code);

    // 3. Execute code
    console.log(`Executing code in ${workDir}`);
    const runProc = Bun.spawn(["bun", "run", "index.ts"], {
      cwd: workDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const runResult = await runProc.exited;
    outputText = await new Response(runProc.stdout).text();
    errorText = await new Response(runProc.stderr).text();

    return {
      success: runResult === 0,
      stdout: outputText,
      stderr: errorText,
    };
  } finally {
    // Clean up
    try {
      await rm(workDir, { recursive: true, force: true });
    } catch (cleanErr) {
      console.error(`Failed to clean up dir ${workDir}`, cleanErr);
    }
  }
}

console.log("Bun Sandbox Server running on http://localhost:3006");
