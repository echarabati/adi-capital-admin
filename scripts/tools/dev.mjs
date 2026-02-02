#!/usr/bin/env node
/**
 * Development Server Starter
 *
 * Features:
 * 1. Auto-kill port 3000 if blocked (supports macOS, Linux, Windows)
 * 2. Always start on port 3000 (OAuth/redirects work consistently)
 *
 * This solves:
 * - Port 3000 blocked after crashed dev server
 * - OAuth callbacks breaking when forced to use different port
 * - Manual `killall node` commands
 *
 * Usage: pnpm dev
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';

const execAsync = promisify(exec);
const PORT = 3000;

/**
 * Kill process using specified port
 * Cross-platform: macOS, Linux, Windows
 */
async function killPort(port) {
  const isWindows = platform() === 'win32';

  try {
    if (isWindows) {
      // Windows: Use netstat + taskkill
      const { stdout } = await execAsync(`netstat -ano | findstr :${port} | findstr LISTENING`);

      const lines = stdout.trim().split('\n');
      const pid = lines[0]?.trim().split(/\s+/).pop();

      if (pid) {
        console.log(`🔧 Puerto ${port} ocupado (PID: ${pid}), liberando...`);
        await execAsync(`taskkill /F /PID ${pid}`);
        console.log(`✅ Puerto ${port} liberado`);
        // Wait for port to fully release
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } else {
      // macOS/Linux: Use lsof
      const { stdout } = await execAsync(`lsof -ti:${port}`);
      const pid = stdout.trim();

      if (pid) {
        console.log(`🔧 Puerto ${port} ocupado (PID: ${pid}), liberando...`);
        await execAsync(`kill -9 ${pid}`);
        console.log(`✅ Puerto ${port} liberado`);
        // Wait for port to fully release
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  } catch {
    // Port is free (lsof/netstat found nothing)
    // This is expected and not an error
  }
}

/**
 * Start Next.js development server
 */
async function startDev() {
  // Kill any process using port 3000
  await killPort(PORT);

  console.log(`🚀 Iniciando Next.js en http://localhost:${PORT}\n`);

  // Start Next.js
  // Use spawn instead of exec to stream output in real-time
  const { spawn } = await import('child_process');

  const child = spawn('pnpm', ['dev:next'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (err) => {
    console.error(`Error al iniciar Next.js: ${err.message}`);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Next.js terminó con código: ${code}`);
    }
    process.exit(code || 0);
  });
}

// Run
startDev().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
