import { TRPCError } from '@trpc/server';

export function resolveRequestPath(url: string): string {
  const parsedUrl = new URL(url);
  const pathParts = parsedUrl.pathname.split('/');
  const trpcPath = pathParts[pathParts.length - 1];

  if (!trpcPath) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Cannot convert Azure Http Request to TRPC Request.',
    });
  }

  return trpcPath;
}
