import dotenv from 'dotenv';
import { deleteProgram, getDidaxisApiToken } from './support/delete-program';
import {
  CREATED_PROGRAMS_DIR,
  getAllCreatedProgramIds,
} from './tests/utils/created-programs';

dotenv.config();

export default async function globalTeardown(): Promise<void> {
  const token = getDidaxisApiToken();
  if (!token) {
    console.warn('DIDAXIS_API_TOKEN is not set; skipping API program cleanup.');
    return;
  }

  const programIds = getAllCreatedProgramIds();
  if (programIds.length === 0) {
    console.log('No programs to delete.');
    return;
  }

  console.log(`Deleting ${programIds.length} program(s) created during test run...`);

  let deleted = 0;
  let failed = 0;

  for (const programId of programIds) {
    const result = await deleteProgram(programId, token);
    if (result.ok) {
      deleted++;
    } else {
      failed++;
      console.warn(
        `Failed to delete program ${programId}: ${result.status} — ${result.message}`,
      );
    }
  }

  console.log(`Program cleanup finished: ${deleted} deleted, ${failed} failed.`);

  try {
    const fs = await import('fs');
    if (fs.existsSync(CREATED_PROGRAMS_DIR)) {
      fs.rmSync(CREATED_PROGRAMS_DIR, { recursive: true, force: true });
    }
  } catch {
    // Non-fatal if the store directory cannot be removed.
  }
}
