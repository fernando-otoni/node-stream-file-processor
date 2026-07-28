export interface UseCase<Input, Output> {
  call(input: Input): Promise<Output>
}