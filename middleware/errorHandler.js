import { wantsHtml } from './requestType.js';

// Prisma error codes that mean the client asked for something invalid, not a server fault
const PRISMA_ERRORS = {
  P2025: [404, 'Not found'], // record to update/delete doesn't exist
  P2003: [404, 'Not found'], // related record (e.g. the post being liked) doesn't exist
  P2002: [409, 'That already exists'], // unique constraint, e.g. a double-submitted like
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const prismaError = !err.statusCode && PRISMA_ERRORS[err.code];
  const status = err.statusCode || err.status || (prismaError && prismaError[0]) || 500;

  // 4xx messages are written for users; 5xx messages can expose internals (DB host, queries)
  let message;
  if (status >= 500) {
    console.error(err);
    message = 'Something went wrong. Please try again.';
  } else {
    message = prismaError ? prismaError[1] : err.message;
  }

  res.status(status);
  if (!wantsHtml(req)) return res.json({ message });
  res.render('pages/error', { message });
};

export default errorHandler;
