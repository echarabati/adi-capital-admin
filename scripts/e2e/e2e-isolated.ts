#!/usr/bin/env node
/**
 * E2E Test Runner with Neon Branch Isolation
 *
 * This script:
 * 1. Creates a temporary Neon branch
 * 2. Starts dev server with branch DATABASE_URL
 * 3. Runs Playwright tests
 * 4. Cleans up branch
 *
 * Usage: pnpm test:e2e
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env.local for NEON_API_KEY and NEON_PROJECT_ID
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { spawn, execSync } from 'child_process';
import { createE2EBranch, deleteE2EBranch } from './neon-branch';

const PORT = 3000;

async function killPort(port: number) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
  } catch {
    // Port already free
  }
}

async function waitForServer(url: string, timeout = 60000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server not ready
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server at ${url} not ready after ${timeout}ms`);
}

async function main() {
  let branchId: string | null = null;
  let serverProcess: ReturnType<typeof spawn> | null = null;

  try {
    // 1. Create Neon branch
    console.log('🌿 Creating Neon branch...');
    const { branchId: id, connectionUri } = await createE2EBranch();
    branchId = id;
    console.log('✅ Branch created');

    // 2. Kill any existing server on port
    await killPort(PORT);

    // 3. Start dev server with branch DATABASE_URL
    console.log('🚀 Starting dev server with isolated database...');
    serverProcess = spawn('pnpm', ['dev:next'], {
      env: { ...process.env, DATABASE_URL: connectionUri },
      stdio: 'pipe',
      shell: true,
    });

    // Wait for server
    await waitForServer(`http://localhost:${PORT}`);
    console.log('✅ Server ready');

    // 4. Run Playwright tests
    console.log('🧪 Running E2E tests...\n');
    const testArgs = process.argv.slice(2);
    const testProcess = spawn(
      'pnpm',
      ['playwright', 'test', '--config=playwright.config.ts', ...testArgs],
      {
        env: { ...process.env, DATABASE_URL: connectionUri },
        stdio: 'inherit',
        shell: true,
      }
    );

    const exitCode = await new Promise<number>((resolve) => {
      testProcess.on('close', (code) => resolve(code ?? 1));
    });

    process.exitCode = exitCode;
  } catch (error) {
    console.error('❌ Error:', error);
    process.exitCode = 1;
  } finally {
    // 5. Cleanup
    console.log('\n🧹 Cleaning up...');

    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    await killPort(PORT);

    if (branchId) {
      await deleteE2EBranch(branchId);
    }

    console.log('✅ Done');
  }
}

main();
