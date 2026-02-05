#!/usr/bin/env npx tsx

/**
 * E2E Setup Script
 *
 * Interactive setup for E2E tests in CI with Neon database.
 * Uses browser-based authentication (no API keys needed).
 *
 * Usage: pnpm setup:e2e
 *
 * Prerequisites:
 * - Neon CLI: npm install -g neonctl (or neon)
 * - GitHub CLI: brew install gh (or see https://cli.github.com/)
 */

import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function exec(cmd: string, options?: { silent?: boolean }): string {
  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      stdio: options?.silent ? 'pipe' : 'inherit',
    });
  } catch {
    return '';
  }
}

function checkCommand(cmd: string): boolean {
  const result = spawnSync('which', [cmd], { encoding: 'utf-8' });
  return result.status === 0;
}

// Detect which Neon CLI is available (modern `neon` or legacy `neonctl`)
function getNeonCli(): string | null {
  if (checkCommand('neon')) return 'neon';
  if (checkCommand('neonctl')) return 'neonctl';
  return null;
}

async function main() {
  console.log('\n🚀 E2E Setup - Configure E2E tests with Neon + GitHub\n');

  // =========================================================================
  // Pre-flight checks
  // =========================================================================
  console.log('📋 Pre-flight checks...\n');

  // Check we're in a git repo
  const gitRoot = exec('git rev-parse --show-toplevel 2>/dev/null', { silent: true }).trim();
  if (!gitRoot) {
    console.error('❌ Not in a git repository');
    process.exit(1);
  }
  console.log('  ✓ Git repository detected');

  // Check e2e.yml.example exists
  const workflowDir = path.join(gitRoot, '.github', 'workflows');
  const templatePath = path.join(workflowDir, 'e2e.yml.example');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ e2e.yml.example not found');
    console.error("   Make sure you're in the timekast-starter-kit repo");
    process.exit(1);
  }
  console.log('  ✓ E2E workflow template found');

  // Check Neon CLI (support both `neon` and `neonctl`)
  const neonCli = getNeonCli();
  if (!neonCli) {
    console.error('❌ Neon CLI not found');
    console.error('   Install with: npm install -g neonctl');
    process.exit(1);
  }
  console.log(`  ✓ Neon CLI found (${neonCli})`);

  // Check GitHub CLI
  if (!checkCommand('gh')) {
    console.error('❌ GitHub CLI not found');
    console.error('   Install with: brew install gh');
    process.exit(1);
  }
  console.log('  ✓ GitHub CLI found');

  // Get repo info
  const repo = exec('gh repo view --json nameWithOwner -q .nameWithOwner', { silent: true }).trim();
  if (!repo) {
    console.error('❌ Could not determine GitHub repo');
    console.error('   Run: gh auth login');
    process.exit(1);
  }
  console.log(`  ✓ GitHub repo: ${repo}\n`);

  // =========================================================================
  // Authentication
  // =========================================================================
  const neonAuth = exec(`${neonCli} me 2>/dev/null`, { silent: true });
  if (!neonAuth) {
    console.log('🔐 Authenticating with Neon...');
    exec(`${neonCli} auth`);
  } else {
    console.log('  ✓ Already authenticated with Neon');
  }

  const ghAuth = exec('gh auth status 2>/dev/null', { silent: true });
  if (!ghAuth.includes('Logged in')) {
    console.log('🔐 Authenticating with GitHub...');
    exec('gh auth login');
  } else {
    console.log('  ✓ Already authenticated with GitHub');
  }

  // =========================================================================
  // Neon Project Selection
  // =========================================================================
  console.log('\n📦 Neon Projects:\n');
  exec(`${neonCli} projects list`);

  const projectChoice = await prompt('\nEnter project name (or "new" to create): ');

  let projectId: string;
  if (projectChoice.toLowerCase() === 'new') {
    const projectName = await prompt('Project name: ');
    const result = exec(`${neonCli} projects create --name "${projectName}" --output json`, {
      silent: true,
    });
    try {
      const parsed = JSON.parse(result);
      // Handle various response formats
      projectId = parsed.project?.id ?? parsed.id;
      if (!projectId) throw new Error('No project ID');
      console.log(`\n  ✓ Created: ${projectName}`);
    } catch {
      console.error('❌ Failed to create project');
      process.exit(1);
    }
  } else {
    const result = exec(`${neonCli} projects list --output json`, { silent: true });
    try {
      const parsed = JSON.parse(result);
      const projects = Array.isArray(parsed) ? parsed : (parsed.projects ?? []);
      const found = projects.find(
        (p: { name: string }) => p.name.toLowerCase() === projectChoice.toLowerCase()
      );
      if (!found) {
        console.error(`❌ Project "${projectChoice}" not found`);
        process.exit(1);
      }
      projectId = found.id;
      console.log(`  ✓ Using: ${found.name}`);
    } catch {
      console.error('❌ Failed to list projects');
      process.exit(1);
    }
  }

  // =========================================================================
  // Get Connection String (let CLI handle default branch)
  // =========================================================================
  console.log('\n🔗 Getting connection string...');

  // Use project-id flag - CLI will use default branch automatically
  const connResult = exec(`${neonCli} connection-string --project-id ${projectId}`, {
    silent: true,
  });

  const connectionString = connResult.trim();
  if (!connectionString.startsWith('postgresql://')) {
    console.error('❌ Invalid connection string');
    console.error(`   Try: ${neonCli} connection-string --project-id ${projectId}`);
    process.exit(1);
  }
  console.log('  ✓ Got DATABASE_URL');

  // =========================================================================
  // Set GitHub Secret (using --body, no temp files)
  // =========================================================================
  console.log('\n📤 Configuring GitHub...\n');
  console.log('  Setting DATABASE_URL secret...');

  // Use --body flag to avoid shell escaping issues and temp files
  const secretResult = spawnSync(
    'gh',
    ['secret', 'set', 'DATABASE_URL', '-R', repo, '--body', connectionString],
    {
      encoding: 'utf-8',
      stdio: 'pipe',
    }
  );

  if (secretResult.status !== 0) {
    console.error('❌ Failed to set secret');
    console.error(secretResult.stderr);
    process.exit(1);
  }
  console.log('  ✓ DATABASE_URL secret set');

  // =========================================================================
  // Copy E2E Workflow
  // =========================================================================
  const targetPath = path.join(workflowDir, 'e2e.yml');
  console.log('  Enabling E2E workflow...');
  fs.copyFileSync(templatePath, targetPath);
  console.log('  ✓ Created .github/workflows/e2e.yml');

  // =========================================================================
  // Done
  // =========================================================================
  console.log('\n✅ Setup complete!\n');

  const shouldCommit = await prompt('Commit and push? (y/n): ');
  if (shouldCommit.toLowerCase() === 'y') {
    exec('git add .github/workflows/e2e.yml');
    exec('git commit -m "chore: enable E2E tests in CI"');
    console.log('\n  ✓ Committed');

    const shouldPush = await prompt('Push now? (y/n): ');
    if (shouldPush.toLowerCase() === 'y') {
      exec('git push');
      console.log('  ✓ Pushed - E2E tests will run on next CI\n');
    } else {
      console.log('  Run: git push\n');
    }
  } else {
    console.log('\n  Next steps:');
    console.log('  git add .github/workflows/e2e.yml');
    console.log('  git commit -m "chore: enable E2E tests in CI"');
    console.log('  git push\n');
  }

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
