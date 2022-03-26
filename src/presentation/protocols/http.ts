/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpResponse<Body = any> {
  statusCode: number;
  body: Body;
}

export interface HttpRequest<Body = any> {
  body?: Body;
}
