export abstract class UnitOfWork {
  abstract runInTransaction<T>(
    work: () => Promise<T>,
  ): Promise<T>;
}