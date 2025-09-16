import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes.js';
import authRouter from './auth.routes.js';
import { ENV } from './services/env.service.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(routes);
app.use('/auth', authRouter);

app.listen(ENV.PORT, () => {
  console.log(
    `[luar] API on http://localhost:${ENV.PORT} (mock=${ENV.WEB3_MOCK})`
  );
});
