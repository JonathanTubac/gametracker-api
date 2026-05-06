export class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true
    }
}

export class ValidationError extends AppError {
    constructor(msg='Validation error'){
        super(msg, 400, 'VALIDATION');
    }
}
export class NotFoundError extends AppError {
    constructor(msg = 'Not found') {
        super(msg, 404, 'NOT_FOUND');
    }
}

export class BadRequest extends AppError {
    constructor (msg = 'Fields missing') {
        super(msg, 400, 'BAD_REQUEST');
    }
}