export interface ProgramSummary {
  id: string;
  name?: string;
}

export type DeleteProgramResult =
  | { ok: true; status: number; alreadyGone: boolean }
  | { ok: false; status: number; message: string };

export function didaxisApiBaseUrl(): string {
  const url = process.env.DIDAXIS_URL ?? 'https://test.didaxis.studio/';
  return url.replace(/\/$/, '');
}

export function getDidaxisApiToken(): string | undefined {
  return process.env.DIDAXIS_API_TOKEN;
}

export async function fetchAllPrograms(token: string): Promise<ProgramSummary[]> {
  const response = await fetch(`${didaxisApiBaseUrl()}/api/programs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `GET /api/programs failed: ${response.status} ${response.statusText}${body ? ` — ${body}` : ''}`,
    );
  }

  const json = (await response.json()) as { data?: Array<{ id?: string; name?: string }> };
  const data = json.data ?? [];

  return data
    .filter((item): item is { id: string; name?: string } => typeof item.id === 'string')
    .map((item) => ({ id: item.id, name: item.name }));
}

export async function deleteProgram(
  programId: string,
  token: string,
): Promise<DeleteProgramResult> {
  const response = await fetch(`${didaxisApiBaseUrl()}/api/programs/${programId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return { ok: true, status: response.status, alreadyGone: false };
  }

  if (response.status === 404) {
    return { ok: true, status: 404, alreadyGone: true };
  }

  const body = await response.text().catch(() => '');
  return {
    ok: false,
    status: response.status,
    message: body || response.statusText,
  };
}
