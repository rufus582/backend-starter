import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export abstract class BaseController {
  protected readonly fastify: FastifyInstance;
  protected readonly prefix: string;

  constructor(fastify: FastifyInstance, prefix: string) {
    this.fastify = fastify;
    this.prefix = prefix;
  }

  registerRoutes(): FastifyInstance {
    return this.fastify.get(`${this.prefix}`, (request, reply) => this.getAll(request, reply))
      .post(`${this.prefix}`, (request, reply) => this.create(request, reply))
      .patch(`${this.prefix}/:id`, (request, reply) => this.update(request, reply))
      .delete(`${this.prefix}/:id`, (request, reply) => this.delete(request, reply));
  }

  abstract create(request: FastifyRequest, reply: FastifyReply): void;
  abstract getAll(request: FastifyRequest, reply: FastifyReply): void;
  abstract getById(request: FastifyRequest, reply: FastifyReply): void;
  abstract update(request: FastifyRequest, reply: FastifyReply): void;
  abstract delete(request: FastifyRequest, reply: FastifyReply): void;
}
