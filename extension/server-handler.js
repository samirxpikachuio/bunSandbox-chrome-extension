export async function executeOnServer(code, packages = "", runtime = "bun") {
  try {
    const response = await fetch('http://localhost:3006/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, packages, runtime }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Server error");
    }

    const result = await response.json();
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      success: result.success
    };
  } catch (error) {
    return {
      success: false,
      stderr: error.message,
      stdout: ""
    };
  }
}
