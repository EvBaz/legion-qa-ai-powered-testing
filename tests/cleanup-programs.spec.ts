import { test } from '../fixtures/cleanup.fixture';
import {
  deleteProgram,
  fetchAllPrograms,
  getDidaxisApiToken,
} from '../lib/delete-program';

const TEST_PREFIXES = ['YB '];

function matchesTestPrefix(name: string | undefined): boolean {
  if (!name) {
    return false;
  }
  return TEST_PREFIXES.some((prefix) => name.includes(prefix));
}

test('Cleanup: delete all test programs matching prefixes', { tag: ['@regression', '@api'] }, async () => {
  const token = getDidaxisApiToken();
  if (!token) {
    test.skip(true, 'DIDAXIS_API_TOKEN is not set');
    return;
  }

  const programs = await fetchAllPrograms(token);
  const toDelete = programs.filter((program) => matchesTestPrefix(program.name));

  if (toDelete.length === 0) {
    console.log('Cleanup complete: deleted 0 test program(s).');
    return;
  }

  let deleted = 0;
  let failed = 0;

  for (const program of toDelete) {
    const result = await deleteProgram(program.id, token);
    if (result.ok) {
      deleted++;
    } else {
      failed++;
      console.warn(
        `Failed to delete ${program.id}${program.name ? ` (${program.name})` : ''}: ${result.status} — ${result.message}`,
      );
    }
  }

  for (const prefix of TEST_PREFIXES) {
    const prefixCount = toDelete.filter((program) => program.name?.includes(prefix)).length;
    if (prefixCount > 0) {
      console.log(`"${prefix}": deleted ${prefixCount}`);
    }
  }

  console.log(`Cleanup complete: ${deleted} deleted, ${failed} failed.`);
});
