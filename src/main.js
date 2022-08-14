import express from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import authRouter from './auth/router.js';
import usersRouter from './user/router.js';
import errorHandler from './middleware/errorHandler.js';
import {
  config, ajv, authController, usersController,
} from './dependencies.js';
import decodeJwt from './middleware/decodeJwt.js';

const PORT = config.get('app.port');
const app = express();

app.use(cors());

app.use(express.json());

app.use('/', authRouter(authController, ajv));
app.use('/', decodeJwt, usersRouter(usersController, ajv));

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server has been started on port ${PORT}...`);
});
