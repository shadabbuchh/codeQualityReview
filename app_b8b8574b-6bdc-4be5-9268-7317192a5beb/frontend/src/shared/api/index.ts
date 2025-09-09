import createClient from 'openapi-fetch';

import type { paths } from '@app/shared/generated-types';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
};

export class ResponseError extends Error {
  code?: number;
  requestId?: string;
  cause?: {
    [key: string]: boolean;
  };
  constructor(
    message: string | undefined,
    code?: number,
    requestId?: string,
    cause?: { [key: string]: boolean }
  ) {
    super(
      message ||
        'API error happened while trying to communicate with the server.'
    );
    this.code = code;
    this.requestId = requestId;
    this.cause = cause;
  }
}

const client = createClient<paths>({
  baseUrl: '/api/v1',
  referrerPolicy: 'no-referrer-when-downgrade',
  headers: DEFAULT_HEADERS,
  credentials: 'include',
  querySerializer: {
    array: {
      style: 'form',
      explode: false,
    },
  },
});

// Middleware
client.use({
  // Middleware to format errors
  async onResponse({ request, response }) {
    if (response.ok) {
      return response;
    }

    // handle errors
    try {
      // attempt to parse the response body as JSON
      const body = await response.clone().json();

      // add code field to body
      body.code = response.status;
      body.requestId = request.headers.get('X-Request-Id');

      return new Response(JSON.stringify(body), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      });
    } catch {
      // noop
    }

    return response;
  },
});

export const {
  DELETE: del,
  GET: get,
  HEAD: head,
  OPTIONS: options,
  PATCH: patch,
  POST: post,
  PUT: put,
  TRACE: trace,
} = client;

export const handleError = (error: unknown): never => {
  if (error && typeof error === 'object') {
    const errorMessage =
      'msg' in error && typeof error.msg === 'string'
        ? error.msg
        : 'message' in error && typeof error.message === 'string'
          ? error.message
          : undefined;

    const errorCode =
      'code' in error && typeof error.code === 'number'
        ? error.code
        : undefined;
    const requestId =
      'requestId' in error && typeof error.requestId === 'string'
        ? error.requestId
        : undefined;
    const cause =
      'cause' in error &&
      typeof error.cause === 'object' &&
      error.cause !== null
        ? Object.fromEntries(
            Object.entries(error.cause as Record<string, unknown>).map(
              ([key, value]) => [key, Boolean(value)]
            )
          )
        : undefined;

    if (errorMessage) {
      throw new ResponseError(errorMessage, errorCode, requestId, cause);
    }
  }

  if (error !== null && typeof error === 'object' && 'stack' in error) {
    console.error(error.stack);
  }

  // the error doesn't have a message or msg property, so we can't throw it as an error. Log it via Sentry so that we can
  // add handling for it.
  // Sentry.captureException(error);

  // throw a generic error if we don't know what the error is. The message is intentionally vague because it might show
  // up in the UI.
  throw new ResponseError(undefined);
};
