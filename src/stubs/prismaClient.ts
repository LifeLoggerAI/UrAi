/**
 * Lightweight Prisma Client stand-in used during builds where the real
 * `@prisma/client` package is unavailable. This keeps type-checking and
 * bundling happy without bundling the heavy native dependency.
 */

type AsyncResult<T = unknown> = Promise<T>;

class PrismaModelStub<TRecord extends Record<string, unknown> = Record<string, unknown>> {
  async findMany(): AsyncResult<TRecord[]> {
    throw new Error(
      "PrismaClient stub: attempted to query data without bundling the real `@prisma/client`."
    );
  }
}

class PrismaClient {
  readonly post = new PrismaModelStub();

  constructor(..._args: unknown[]) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Using stubbed PrismaClient. Install and generate `@prisma/client` when database access is required."
      );
    }
  }

  async $connect(): AsyncResult<void> {
    return Promise.resolve();
  }

  async $disconnect(): AsyncResult<void> {
    return Promise.resolve();
  }

  async $transaction<T>(promises: AsyncResult<T>[]): AsyncResult<T[]> {
    return Promise.all(promises);
  }
}

export { PrismaClient };
export default PrismaClient;
