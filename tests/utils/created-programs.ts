import fs from 'fs';
import path from 'path';

export const CREATED_PROGRAMS_DIR = path.join(process.cwd(), '.playwright-created-programs');

export function resetCreatedProgramsStore(): void {
  if (fs.existsSync(CREATED_PROGRAMS_DIR)) {
    fs.rmSync(CREATED_PROGRAMS_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(CREATED_PROGRAMS_DIR, { recursive: true });
}

export function recordCreatedProgram(id: string, workerIndex: number): void {
  fs.mkdirSync(CREATED_PROGRAMS_DIR, { recursive: true });
  const file = path.join(CREATED_PROGRAMS_DIR, `worker-${workerIndex}.txt`);
  fs.appendFileSync(file, `${id}\n`, 'utf8');
}

export function getAllCreatedProgramIds(): string[] {
  if (!fs.existsSync(CREATED_PROGRAMS_DIR)) {
    return [];
  }

  const ids = new Set<string>();
  for (const file of fs.readdirSync(CREATED_PROGRAMS_DIR)) {
    const content = fs.readFileSync(path.join(CREATED_PROGRAMS_DIR, file), 'utf8');
    for (const line of content.split('\n')) {
      const id = line.trim();
      if (id) {
        ids.add(id);
      }
    }
  }
  return [...ids];
}
