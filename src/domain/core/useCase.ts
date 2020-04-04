export interface UseCase<TData, TReturn> {
  execute(data: TData): Promise<TReturn>;
}
