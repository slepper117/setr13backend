import express from 'express';
import bookingsRoutes from './routes/bookings.js';
import roomsRoutes from './routes/rooms.js';
import clocksRoutes from './routes/clocks.js';
import areasRoutes from './routes/areas.js';
import usersRoutes from './routes/users.js';
import { Error404 } from './classes/errors.js';
import { errorLogger, errorHandler } from './middleware/errorHandling.js';

// Inicialização da APP
const app = express();
const port = process.env.PORT;
const domain = process.env.DOMAIN;

// Configurações
app.use(express.json());

// Rotas
app.use('/booking', bookingsRoutes);
app.use('/rooms', roomsRoutes);
app.use('/clock', clocksRoutes);
app.use('/areas', areasRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.json({ teste: 'ola' });
});

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
