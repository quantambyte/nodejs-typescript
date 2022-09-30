import express from 'express';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';

import authorRoutes from './routes/Author';
import bookRoutes from './routes/Book';

const app = express();

/** Connect to MONGODB */
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('Connected to MONGODB');
    startServer();
  })
  .catch((error) => {
    Logging.error('Unable to Connect');
    Logging.error(error);
  });

/** Only start the server if Mongo Connects */
const startServer = () => {
  app.use((req, res, next) => {
    /**Log the Request */
    Logging.info(
      `Incoming => Method:[${req.method}] - Url:[${req.url}] - IP:[${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      /** Log the Response */
      Logging.info(
        `Incoming => Method:[${req.method}] - Url:[${req.url}] - IP:[${req.socket.remoteAddress}] - Status:[${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  /** Rules of the API */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  app.use('/authors', authorRoutes);
  app.use('/books', bookRoutes);

  /** Health Check */
  app.get('/ping', (req, res, next) =>
    res.status(200).json({ message: 'pong' })
  );

  /** Error Handling */
  app.use((req, res, next) => {
    const error = new Error('Not Found');
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  app.listen(config.server.port, () => {
    Logging.info(`Server is Running at PORT ${config.server.port}`);
  });
};
