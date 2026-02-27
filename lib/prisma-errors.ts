export function isPrismaUniqueError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    // Prisma known request error code for unique constraint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e as any).code === "P2002"
  );
}