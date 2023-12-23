import fastify from 'fastify';
import express from '@fastify/express';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import * as db from './db';

dotenv.config();

const server = fastify();

server.register(express);

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

db.connectDB();

server.get('/', async (request, reply) => {
  return { message: 'Hello, !' };
});

const port  = process.env.PORT ? +process.env.PORT : 3000;
server.listen({port}).then(() => { console.log(`Server is listening on port ${port}`); });
