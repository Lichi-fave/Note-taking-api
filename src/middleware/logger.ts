import { Request, Response, NextFunction } from "express";

// this is the shape of the log entry we want to create for each incoming request
interface LogEntry {
  method: string; // HTTP method (GET, POST, etc.)
  url: string; // requested URL
  statusCode: number; // HTTP status code of the response
  timestamp: string; // time when the request was received
  duration: string; // time taken to process the request
}

// logger middleware function
export const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now(); // record the start time of the request

  // this event listener will be called when the response is finished being sent to the client
  res.on("finish", () => {
    const duration = Date.now() - startTime; // calculate how long the request took

    const logEntry: LogEntry = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    };

    console.log(
      `[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} - ${logEntry.statusCode} (${logEntry.duration})`,
    ); // log the entry to the console
  });

  next(); // call the next middleware or route handler in the stack
};
