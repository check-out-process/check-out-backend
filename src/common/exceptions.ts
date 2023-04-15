export class NotFoundError extends Error {
    statusCode = 404;
    constructor(msg: string){super(msg)}
}