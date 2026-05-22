// custom error class that carries an HTTP status code and a message

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // calls built_in error class with the message
    this.statusCode = statusCode; // attaches HTTP status code to the error
    this.name = "AppError"; // sets the error name to AppError for easier identification
  }
}
