import fastifyPassport from '@fastify/passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

fastifyPassport.use('local', new LocalStrategy(async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    if(await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  } catch (error) {
    console.log(error);
    
    done(error);
  }
}));

fastifyPassport.registerUserSerializer(async (user: any, request: FastifyRequest) => user.id);

fastifyPassport.registerUserDeserializer(async (id: number, request: FastifyRequest) => {
  return await User.findByPk(id);
});

export default fastifyPassport;

export const verifyAuth = {
  preHandler: (request: FastifyRequest, reply: FastifyReply, done: any) => {
    if(request.isAuthenticated()) {
      return done();
    } else {
      reply.status(401).send({ message: 'Unauthorized!' });
    }
  }
};
