import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyAuth } from '../authentication/auth';

export abstract class BaseController {
  protected readonly fastify: FastifyInstance;
  protected readonly prefix: string;

  constructor(fastify: FastifyInstance, prefix: string) {
    this.fastify = fastify;
    this.prefix = prefix;
  }

  registerRoutes(): FastifyInstance {
    return this.fastify
      .get(`${this.prefix}`, verifyAuth, (request, reply) => this.getAll(request, reply))
      .get(`${this.prefix}/:id`, verifyAuth, (request, reply) => this.getById(request, reply))
      .post(`${this.prefix}`, verifyAuth, (request, reply) => this.create(request, reply))
      .patch(`${this.prefix}/:id`, verifyAuth, (request, reply) => this.update(request, reply))
      .delete(`${this.prefix}/:id`, verifyAuth, (request, reply) => this.delete(request, reply));
  }

  abstract create(request: FastifyRequest, reply: FastifyReply): void;
  abstract getAll(request: FastifyRequest, reply: FastifyReply): void;
  abstract getById(request: FastifyRequest, reply: FastifyReply): void;
  abstract update(request: FastifyRequest, reply: FastifyReply): void;
  abstract delete(request: FastifyRequest, reply: FastifyReply): void;
}
