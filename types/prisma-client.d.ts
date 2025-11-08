declare module "@prisma/client" {
  class PrismaClient {
    constructor(...args: unknown[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction<T>(promises: Promise<T>[]): Promise<T[]>;
    readonly post: {
      findMany(): Promise<Record<string, unknown>[]>;
    };
  }

  export { PrismaClient };
  export default PrismaClient;
}
