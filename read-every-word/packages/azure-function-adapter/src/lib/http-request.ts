import type { HttpRequest as AzureHttpRequest } from '@azure/functions';

export async function toHTTPRequest(
  request: AzureHttpRequest
): Promise<Request> {
  const body = await request.text();
  const url = new URL(request.url);

  // Copy query params
  for (const [key, value] of request.query.entries()) {
    if (typeof value !== 'undefined') {
      url.searchParams.append(key, value);
    }
  }

  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (typeof value !== 'undefined') {
      headers.append(key, value);
    }
  }

  return new Request(url.toString(), {
    method: request.method || 'GET',
    headers,
    body: body || undefined,
  });
}
