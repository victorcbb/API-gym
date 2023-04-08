export class ResourceNotFFoundError extends Error {
  constructor() {
    super('Resource not found.')
  }
}
