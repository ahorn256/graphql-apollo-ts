import express from 'express';
import graphqlHTTP from 'express-graphql';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import schema from './schema.js';

const port = process.env.REACT_APP_BACKEND_PORT;
const secret = 'topSecret!';
const user = 'test';
const password = 'test';

const server = express();

server.use(express.json());
server.use(cors());

server.post('/login', (req, res, next) => {
  if (req.body.user === user && req.body.password === password) {
    res.send(
      jwt.sign({ user: req.body.user }, secret, { expiresIn: '1800s' })
    );
  } else {
    res.sendStatus(403);
  }
});

server.use('/', (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, secret);
    next();
  } catch (e) {
    res.sendStatus(403);
  }
});

server.use(
  '/api',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

server.listen(port, () =>
  console.log(`server is listening to http://localhost:${port}`)
);
