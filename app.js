import express from 'express';
import cookieParser from 'cookie-parser';
import accessRoutes from './routes/access.js';
import areasRoutes from './routes/areas.js';
import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import clocksRoutes from './routes/clocks.js';
import roomsRoutes from './routes/rooms.js';
import usersRoutes from './routes/users.js';
import { Error404 } from './classes/errors.js';
import { errorLogger, errorHandler } from './middleware/errorHandling.js';

// Inicialização da APP
const app = express();
const port = process.env.PORT;
const domain = process.env.DOMAIN;

// Configurações
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use('/access', accessRoutes);
app.use('/areas', areasRoutes);
app.use('/auth', authRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/clocks', clocksRoutes);
app.use('/rooms', roomsRoutes);
app.use('/users', usersRoutes);

// Middleware de Erros
app.all('*', (req, res, next) => {
  try {
    throw new Error404(
      'route-not-found',
      'The route your looking for does not exist.'
    );
  } catch (e) {
    next(e);
  }
});

// Middleware de gestão de erros
app.use(errorLogger);
app.use(errorHandler);

// Servidor
app.listen(port, () =>
  console.log(`A aplicação esta a funcionar em ${domain}:${port}`)
);
