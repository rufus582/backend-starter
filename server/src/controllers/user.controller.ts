import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { User } from '../models';
import { BaseController } from './controller';

export class UserController extends BaseController {
  public registerRoutes(): FastifyInstance {
    return super.registerRoutes()
      .post(`${this.prefix}/login`, (request, reply) => this.login(request, reply))
      .post(`${this.prefix}/logout`, (request, reply) => this.logout(request, reply));
  }

  login(request: FastifyRequest, reply: FastifyReply) {
    // TODO: Implement login logic
  }

  logout(request: FastifyRequest, reply: FastifyReply) {
    // TODO: Implement logout logic
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await User.findAll()
      reply.status(200).send(users);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: 'Error retrieving users!' });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const user = await User.findByPk(id);
      reply.status(200).send(user);
    } catch(error) {
      console.error(error);
      reply.status(500).send({ message: 'Error retrieving user!' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, password, role } = request.body as any;

    try {
      const user = await User.findOne({ where: { email } });
      if(user) {
        reply.status(400).send({ message: 'User already exists!' });
        return;
      } else {
        await User.create({
          email,
          name,
          password,
          role,
        });
    
        reply.status(201).send({ message: 'User created successfully!' });
      }
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: 'Error creating user!' });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id, email, name, password, role } = request.body as any;

    try {
      const user = await User.findByPk(id);
    
      if (user) {
        await user.update({
          email,
          name,
          password,
          role,
        });
    
        reply.status(200).send({ message: 'User updated successfully!' });
      } else {
        reply.status(404).send({ message: 'User not found!' });
      }
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: 'Error updating user!' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        reply.status(200).send({ message: 'User deleted successfully!' });
      } else {
        reply.status(404).send({ message: 'User not found!' });
      }
    } catch (error) {
      reply.status(500).send({ message: 'Error deleting user!' });
    }
  }
}
