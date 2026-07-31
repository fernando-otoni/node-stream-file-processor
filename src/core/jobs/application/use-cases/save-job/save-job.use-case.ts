import { UseCase } from "src/core/shared/application/use-case.interface";
import { SaveJobInput } from "./save-job.input";

export class SaveJobUseCase implements UseCase<SaveJobInput, void> {
  constructor () {}

  async call(input: SaveJobInput) { }
}