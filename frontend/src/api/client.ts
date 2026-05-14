// client.ts
// Description: Typed fetch wrapper with timeout for backend API calls

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function parseJSON<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchJSON<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetchWithTimeout(url, options);
  return parseJSON<T>(response);
}
