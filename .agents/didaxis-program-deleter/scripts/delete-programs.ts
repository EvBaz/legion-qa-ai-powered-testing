import dotenv from 'dotenv';
import path from 'path';
import {
  deleteProgram,
  fetchAllPrograms,
  getDidaxisApiToken,
  type ProgramSummary,
} from '../../../support/delete-program';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface CliOptions {
  dryRun: boolean;
  ids: string[];
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { dryRun: false, ids: [] };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--all') {
      // Explicit "all programs" scope; default when no --id is provided.
    } else if (arg === '--id') {
      const id = argv[++i];
      if (!id) {
        console.error('Error: --id requires a program UUID.');
        process.exit(1);
      }
      options.ids.push(id);
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else {
      console.error(`Error: unknown argument "${arg}".`);
      printUsage();
      process.exit(1);
    }
  }

  return options;
}

function printUsage(): void {
  console.log(`Usage (run from project root):
  npx tsx .agents/didaxis-program-deleter/scripts/delete-programs.ts
  npx tsx .agents/didaxis-program-deleter/scripts/delete-programs.ts --all --dry-run
  npx tsx .agents/didaxis-program-deleter/scripts/delete-programs.ts --id <PROGRAM_UUID> [--id <UUID> ...]`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const token = getDidaxisApiToken();

  if (!token) {
    console.error('DIDAXIS_API_TOKEN is not set in .env');
    process.exit(1);
  }

  let scope: string;
  let programs: ProgramSummary[];
  let foundViaGet: number | null = null;

  if (options.ids.length > 0) {
    scope = `specific UUID(s): ${options.ids.join(', ')}`;
    programs = options.ids.map((id) => ({ id }));
  } else {
    scope = 'all programs';
    programs = await fetchAllPrograms(token);
    foundViaGet = programs.length;
  }

  if (options.dryRun) {
    console.log('\n**Scope:**', scope);
    console.log('**Found via GET:**', foundViaGet ?? 'n/a (specific IDs)');
    console.log('**Would delete:**', programs.length);
    for (const program of programs) {
      const label = program.name ? `${program.id} (${program.name})` : program.id;
      console.log(`  - ${label}`);
    }
    console.log('**Deleted:** none (dry run)');
    console.log('**Failed:** none');
    return;
  }

  const deleted: string[] = [];
  const alreadyGone: string[] = [];
  const failed: Array<{ id: string; status: number; message: string }> = [];

  for (const program of programs) {
    const result = await deleteProgram(program.id, token);
    if (result.ok) {
      if (result.alreadyGone) {
        alreadyGone.push(program.id);
      } else {
        deleted.push(program.id);
      }
    } else {
      failed.push({
        id: program.id,
        status: result.status,
        message: result.message,
      });
    }
  }

  console.log('\n**Scope:**', scope);
  console.log('**Found via GET:**', foundViaGet ?? programs.length);
  console.log('**Deleted:**', deleted.length ? deleted.join(', ') : 'none');
  if (alreadyGone.length) {
    console.log('**Already removed (404):**', alreadyGone.join(', '));
  }
  console.log(
    '**Failed:**',
    failed.length
      ? failed.map((f) => `${f.id} (${f.status}: ${f.message})`).join('; ')
      : 'none',
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
