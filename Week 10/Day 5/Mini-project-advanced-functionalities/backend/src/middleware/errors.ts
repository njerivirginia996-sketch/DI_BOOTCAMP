import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFound: RequestHandler = (_request, response) => {
  response.status(404).json({ message: 'The requested resource was not found.' });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error('Request failed:', error instanceof Error ? error.message : 'Unknown error');
  if (response.headersSent) {
    return;
  }
  if (typeof error === 'object' && error !== null && 'status' in error && error.status === 400) {
    response.status(400).json({ message: 'The request body is invalid.' });
    return;
  }
  response.status(500).json({ message: 'An unexpected server error occurred.' });
};
