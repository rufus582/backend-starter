import fastify from 'fastify';
import express from '@fastify/express';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import sequelize from './db';
import { syncDB } from './sync';

dotenv.config();

const server = fastify();

server.register(express);

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

syncDB({
  alter: false, // alter: true will update all tables with new fields
  force: false, // force: true will drop all tables if it already exists
});

server.get('/', async (request, reply) => {
  return { message: 'Hello, !' };
});

const port  = process.env.PORT ? +process.env.PORT : 3000;
server.listen({port}).then(() => { console.log(`Server is listening on port ${port}`); });
