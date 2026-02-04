/**
 * Neon Branch Utilities for E2E Tests
 *
 * Creates and deletes temporary Neon branches for isolated E2E testing.
 * Branches are created with auto-expiration as a safety net.
 *
 * @see https://neon.tech/docs/manage/branches
 */

const NEON_API_BASE = 'https://console.neon.tech/api/v2';

interface NeonBranchResponse {
  branch: {
    id: string;
    name: string;
    project_id: string;
  };
  endpoints: Array<{
    id: string;
    host: string;
  }>;
  connection_uris: Array<{
    connection_uri: string;
  }>;
}

interface NeonConfig {
  apiKey: string;
  projectId: string;
}

function getConfig(): NeonConfig {
  const apiKey = process.env.NEON_API_KEY;
  const projectId = process.env.NEON_PROJECT_ID;

  if (!apiKey || !projectId) {
    throw new Error('Missing NEON_API_KEY or NEON_PROJECT_ID. Required for E2E test branching.');
  }

  return { apiKey, projectId };
}

/**
 * Create a temporary Neon branch for E2E tests.
 *
 * @param branchName - Name for the branch (default: e2e-{timestamp})
 * @param expiresInHours - Auto-delete after N hours (default: 1)
 * @returns Connection URI for the new branch
 */
export async function createE2EBranch(
  branchName?: string,
  expiresInHours = 1
): Promise<{ branchId: string; connectionUri: string }> {
  const { apiKey, projectId } = getConfig();
  const name = branchName || `e2e-${Date.now()}`;

  // Calculate expiration timestamp
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

  const response = await fetch(`${NEON_API_BASE}/projects/${projectId}/branches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branch: {
        name,
      },
      endpoints: [
        {
          type: 'read_write',
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Neon branch: ${response.status} ${error}`);
  }

  const data = (await response.json()) as NeonBranchResponse;
  const connectionUri = data.connection_uris[0]?.connection_uri;

  if (!connectionUri) {
    throw new Error('Neon branch created but no connection URI returned');
  }

  console.log(`[Neon] Created branch: ${name} (expires in ${expiresInHours}h)`);

  return {
    branchId: data.branch.id,
    connectionUri,
  };
}

/**
 * Delete a Neon branch.
 *
 * @param branchId - The branch ID to delete
 */
export async function deleteE2EBranch(branchId: string): Promise<void> {
  const { apiKey, projectId } = getConfig();

  const response = await fetch(`${NEON_API_BASE}/projects/${projectId}/branches/${branchId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[Neon] Failed to delete branch ${branchId}: ${response.status} ${error}`);
    return;
  }

  console.log(`[Neon] Deleted branch: ${branchId}`);
}

// CLI usage for manual testing
if (require.main === module) {
  const action = process.argv[2];

  if (action === 'create') {
    createE2EBranch()
      .then(({ branchId, connectionUri }) => {
        console.log('Branch ID:', branchId);
        console.log('Connection URI:', connectionUri);
      })
      .catch(console.error);
  } else if (action === 'delete') {
    const branchId = process.argv[3];
    if (!branchId) {
      console.error('Usage: tsx neon-branch.ts delete <branchId>');
      process.exit(1);
    }
    deleteE2EBranch(branchId).catch(console.error);
  } else {
    console.log('Usage: tsx neon-branch.ts [create|delete <branchId>]');
  }
}
