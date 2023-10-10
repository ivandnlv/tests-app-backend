class DefaultError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof NotFound) {
      return 404;
    } else if (this instanceof BadRequest) {
      return 400;
    } else if (this instanceof Unauthorized) {
      return 401;
    } else if (this instanceof NoAccess) {
      return 403;
    } else {
      return 500;
    }
  }
}

class NotFound extends DefaultError {}
class BadRequest extends DefaultError {}
class Unauthorized extends DefaultError {}
class NoAccess extends DefaultError {}

export { BadRequest, DefaultError, NoAccess, NotFound, Unauthorized };
