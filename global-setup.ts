import { resetCreatedProgramsStore } from './lib/created-programs';

export default function globalSetup(): void {
  resetCreatedProgramsStore();
}
