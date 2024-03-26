import { rateLimit } from "express-rate-limit";

/**
 * Middleware that helps prevent brute-force attacks:
 * it limits the amount of requests possible within a time period.
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request, response, next, options) => {
    // console.log(options);
    options.message = `Too many requests, please try again in ${Math.floor(
      options.windowMs / 60000
    )} minutes.`;
    response.status(options.statusCode).json({ error: options.message });
  },
});
