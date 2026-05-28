import { resetCreatedProgramsStore } from './tests/utils/created-programs';

export default function globalSetup(): void {
  resetCreatedProgramsStore();
}
