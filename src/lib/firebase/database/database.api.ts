export interface FirebaseDatabaseApi {
  get(path: string): Promise<unknown>;
  set(path: string, value: unknown): Promise<unknown>;
  update(path: string, value: Partial<unknown>): Promise<unknown>;
  listen(path: string, cb: (value: unknown) => void): () => unknown;
}

export const createFirebaseDatabase = (impl: FirebaseDatabaseApi) => impl;
