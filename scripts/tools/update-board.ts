import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

/**
 * Update Board Script
 *
 * Intelligently scans `docs/backlog/` and generates a hierarchical
 * `docs/backlog/BOARD.md` file.
 *
 * Auto-detects structure:
 * - If milestone folders exist (v1.0, v2.1, etc.) → group by milestone
 * - If epic metadata exists → group by epic within milestone
 * - If flat structure → just show issues
 *
 * Usage: pnpm update-board
 */

const BACKLOG_DIR = 'docs/backlog';
const ISSUES_GLOB = `${BACKLOG_DIR}/**/issues/*.md`;
const BOARD_FILE = path.join(BACKLOG_DIR, 'BOARD.md');

interface Issue {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'wont-do' | 'postponed';
  priority: string;
  epic?: string;
  milestone?: string;
  path: string;
}

function parseStatus(content: string): Issue['status'] {
  if (content.match(/[>-] \*\*(Status|Estado):\*\*.*(✅|Completed|Completado|Done)/i))
    return 'done';
  if (content.match(/[>-] \*\*(Status|Estado):\*\*.*(In Progress|En Progreso|🚧|Working)/i))
    return 'in-progress';
  if (
    content.match(
      /[>-] \*\*(Status|Estado):\*\*.*(Won't Do|Wont Do|Cancelled|Cancelado|❌|No se hará)/i
    )
  )
    return 'wont-do';
  if (
    content.match(
      /[>-] \*\*(Status|Estado):\*\*.*(Postponed|Pospuesto|Deferred|Diferido|⏸️|Post-MVP)/i
    )
  )
    return 'postponed';
  return 'todo';
}

function parsePriority(content: string): string {
  const match = content.match(/[>-] \*\*(Priority|Prioridad):\*\* (.*)/i);
  return match ? match[2].trim() : '';
}

function parseEpic(content: string): string | undefined {
  const match = content.match(/[>-] \*\*Epic:\*\* (.*)/i);
  return match ? match[1].trim() : undefined;
}

function parseTitle(content: string): string {
  const match = content.match(/^# ([\w-]+): (.*)$/m);
  return match ? `${match[1]}: ${match[2]}` : 'Sin Título';
}

function extractMilestone(filePath: string): string | undefined {
  // Extract milestone from path like "v1.1/issues/..." or "v2.0/issues/..."
  const match = filePath.match(/\/?(v[\d.]+)\//i);
  return match ? match[1] : undefined;
}

async function main() {
  console.log('📋 Updating Backlog Board...');

  const files = await glob(ISSUES_GLOB);
  const issues: Issue[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(BACKLOG_DIR, file);

    issues.push({
      id: path.basename(file, '.md'),
      title: parseTitle(content),
      status: parseStatus(content),
      priority: parsePriority(content),
      epic: parseEpic(content),
      milestone: extractMilestone(relativePath),
      path: relativePath,
    });
  }

  // Detect structure
  const hasMilestones = issues.some((i) => i.milestone);
  const hasEpics = issues.some((i) => i.epic);

  console.log(
    `  Structure: ${hasMilestones ? 'Milestones' : 'Flat'}, Epics: ${hasEpics ? 'Yes' : 'No'}`
  );

  const content = hasMilestones
    ? generateMilestoneBoard(issues, hasEpics)
    : generateFlatBoard(issues);

  fs.writeFileSync(BOARD_FILE, content);
  console.log(`✅ Board updated with ${issues.length} issues: ${BOARD_FILE}`);
}

function generateMilestoneBoard(issues: Issue[], groupByEpic: boolean): string {
  // Group by milestone
  const milestones = new Map<string, Issue[]>();

  for (const issue of issues) {
    const key = issue.milestone || 'Backlog';
    if (!milestones.has(key)) milestones.set(key, []);
    milestones.get(key)!.push(issue);
  }

  // Sort milestones (newest first: v2.1 > v1.1)
  const sortedMilestones = Array.from(milestones.entries()).sort((a, b) =>
    b[0].localeCompare(a[0], undefined, { numeric: true })
  );

  let md = `# 🚴 Sprint Board

> **Auto-generated** by \`pnpm update-board\`. Do not edit manually.

`;

  for (const [milestone, milestoneIssues] of sortedMilestones) {
    const inProgress = milestoneIssues.filter((i) => i.status === 'in-progress');
    const todo = milestoneIssues.filter((i) => i.status === 'todo');
    const done = milestoneIssues.filter((i) => i.status === 'done');
    const postponed = milestoneIssues.filter((i) => i.status === 'postponed');
    const wontDo = milestoneIssues.filter((i) => i.status === 'wont-do');

    md += `## ${milestone}\n\n`;
    md += `| Status | Count |\n|--------|-------|\n`;
    md += `| 🚧 In Progress | ${inProgress.length} |\n`;
    md += `| 📅 To Do | ${todo.length} |\n`;
    md += `| ✅ Done | ${done.length} |\n`;
    if (postponed.length > 0) md += `| ⏸️ Postponed | ${postponed.length} |\n`;
    if (wontDo.length > 0) md += `| ❌ Won't Do | ${wontDo.length} |\n`;
    md += '\n';

    if (inProgress.length > 0) {
      md += `### 🚧 In Progress\n\n`;
      md += renderIssueList(inProgress, groupByEpic);
      md += '\n';
    }

    if (todo.length > 0) {
      md += `### 📅 To Do\n\n`;
      md += renderIssueList(todo, groupByEpic);
      md += '\n';
    }

    if (done.length > 0) {
      md += `<details>\n<summary>✅ Done (${done.length})</summary>\n\n`;
      md += renderIssueList(done, false); // Don't group done by epic
      md += '</details>\n\n';
    }

    if (postponed.length > 0) {
      md += `<details>\n<summary>⏸️ Postponed (${postponed.length})</summary>\n\n`;
      md += renderIssueList(postponed, false);
      md += '</details>\n\n';
    }

    if (wontDo.length > 0) {
      md += `<details>\n<summary>❌ Won't Do (${wontDo.length})</summary>\n\n`;
      md += renderIssueList(wontDo, false);
      md += '</details>\n\n';
    }

    md += '---\n\n';
  }

  return md;
}

function generateFlatBoard(issues: Issue[]): string {
  const todo = issues.filter((i) => i.status === 'todo');
  const inProgress = issues.filter((i) => i.status === 'in-progress');
  const done = issues.filter((i) => i.status === 'done');
  const postponed = issues.filter((i) => i.status === 'postponed');
  const wontDo = issues.filter((i) => i.status === 'wont-do');

  let md = `# 🚴 Sprint Board

> **Auto-generated** by \`pnpm update-board\`. Do not edit manually.

## 🚧 In Progress (${inProgress.length})
${renderIssueList(inProgress, false)}

## 📅 To Do (${todo.length})
${renderIssueList(todo, false)}

## ✅ Done (${done.length})
${renderIssueList(done, false)}
`;

  if (postponed.length > 0) {
    md += `
## ⏸️ Postponed (${postponed.length})
${renderIssueList(postponed, false)}
`;
  }

  if (wontDo.length > 0) {
    md += `
## ❌ Won't Do (${wontDo.length})
${renderIssueList(wontDo, false)}
`;
  }

  return md;
}

function renderIssueList(issues: Issue[], groupByEpic: boolean): string {
  if (issues.length === 0) return '_No issues_\n';

  if (!groupByEpic) {
    return (
      issues
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((i) => `- [${i.title}](${i.path})${getPriorityBadge(i.priority)}`)
        .join('\n') + '\n'
    );
  }

  // Group by epic
  const byEpic = new Map<string, Issue[]>();
  for (const issue of issues) {
    const key = issue.epic || 'Other';
    if (!byEpic.has(key)) byEpic.set(key, []);
    byEpic.get(key)!.push(issue);
  }

  let result = '';
  for (const [epic, epicIssues] of Array.from(byEpic.entries()).sort()) {
    if (epic !== 'Other') {
      result += `**${epic}** (${epicIssues.length})\n`;
    }
    for (const issue of epicIssues.sort((a, b) => a.id.localeCompare(b.id))) {
      result += `- [${issue.title}](${issue.path})${getPriorityBadge(issue.priority)}\n`;
    }
    result += '\n';
  }

  return result;
}

function getPriorityBadge(priority: string): string {
  if (priority.includes('P0') || priority.includes('Crítico')) return ' 🔴';
  if (priority.includes('P1')) return ' 🟡';
  return '';
}

main().catch(console.error);
