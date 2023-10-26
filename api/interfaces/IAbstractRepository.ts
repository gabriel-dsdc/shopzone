export interface IAbstractRepository<T> {
  findAll(id: string): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<T | null>;
}
