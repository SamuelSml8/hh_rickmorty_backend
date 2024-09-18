import { ResponseApiHh } from './interfaces/response.interface';

export function createResponse<S>(
  ok: boolean,
  message: string,
  data: S,
): ResponseApiHh<S> {
  return {
    ok,
    message,
    data,
  };
}
