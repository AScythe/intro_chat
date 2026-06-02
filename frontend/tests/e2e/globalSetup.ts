// globalSetup.ts
// Description: Playwright global setup — wipes e2e_test.db before each test run

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function () {
  const scriptPath = path.resolve(__dirname, 'helpers', 'cleanup_e2e_db.py');
  execSync(`uv run python "${scriptPath}"`, { stdio: 'inherit' });
}
