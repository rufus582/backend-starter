import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { User } from '../models';
import { BaseController } from './controller';
import bcrypt from 'bcrypt';
import fastifyPassport, { verifyAuth } from '../authentication/auth';

export class UserController extends BaseController {
  options = {
    attributes: {
      exclude: ['password'],
    }
  };

  constructor(fastify: FastifyInstance, prefix: string) {
    super(fastify, prefix);
  }

  public registerRoutes(): FastifyInstance {
    return super.registerRoutes()
      .post(`${this.prefix}/register`, this.create)
      .post(`${this.prefix}/login`, { preValidation: fastifyPassport.authenticate('local', { authInfo: true }) }, this.login)
      .post(`${this.prefix}/logout`, verifyAuth, this.logout);
  }

  login(request: FastifyRequest, reply: FastifyReply): any {
    const user = {
      ...(request.user as any).dataValues,
      password: undefined,
    }
    reply.status(200).send(user);
  }

  logout(request: FastifyRequest, reply: FastifyReply) {
    request.logout();
    reply.status(200).send({ message: 'Logged out successfully!' });
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      if((request.user as any).role !== 'admin') {
        reply.status(403).send({ message: 'You need to be an admin to access this!' });
        return;
      }

      const users = await User.findAll(this.options);
      reply.status(200).send(users);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: 'Error retrieving users!' });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      let id = +(request.user as any).id;

      // Only admins can access other users
      if((request.user as any).role === 'admin') {
        id = +(request.params as any).id;
      }

      const user = await User.findByPk(id, this.options);
      reply.status(200).send(user);
    } catch(error) {
      console.error(error);
      reply.status(500).send({ message: 'Error retrieving user!' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, password, role } = request.body as any;

    try {
      // Check if user already exists
      const user = await User.findOne({ where: { email } });
      if(user) {
        reply.status(400).send({ message: 'User already exists!' });
        return;
      }

      // Create user
      const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS ?? '10');
      await User.create({
        email,
        name,
        password: hash,
        role,
      });
  
      reply.status(201).send({ message: 'User created successfully!' });
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
        // Check if email is already in use
        const duplicateUser = await User.findOne({ where: { email } });
        if(duplicateUser) {
          reply.status(400).send({ message: 'Duplicate email address!' });
          return;
        }

        // Update user
        const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS ?? '10');
        await user.update({
          email,
          name,
          password: hash,
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
    let id = +(request.user as any).id;

    // Only admins can delete other users
    if((request.user as any).role === 'admin') {
      id = +(request.params as any).id;
    }

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
