import type {
  HttpResponse as AzureHttpResponse,
  HttpResponseInit,
} from '@azure/functions';

export async function toAzureResponse(
  response: Response
): Promise<HttpResponseInit | AzureHttpResponse> {
  const body = await response.text();
  const headers: Record<string, string> = {};

  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    body: body || undefined,
    status: response.status,
    headers,
  };
}
