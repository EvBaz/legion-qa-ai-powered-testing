import { faker } from '@faker-js/faker';

export type ProgramPayload = {
  name: string;
  description: string;
};

/** Happy-path program data with a unique suffix so parallel runs do not collide. */
export function buildProgram(overrides: Partial<ProgramPayload> = {}): ProgramPayload {
  const suffix = Date.now();
  return {
    name: `${faker.company.catchPhrase()} ${suffix}`,
    description: faker.lorem.paragraph({ min: 1, max: 2 }),
    ...overrides,
  };
}
