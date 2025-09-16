import { Router } from 'express';
import {
  health,
  friendbot,
  recordExpense,
  reserve,
  finalize,
  debugReservations,
  clientStatus,
  adminSummary,
} from './controllers/loyalty.controller.js';

const r = Router();
r.get('/health', health);
r.post('/friendbot', friendbot);
r.post('/record_expense', recordExpense);
r.post('/reserve', reserve);
r.post('/finalize', finalize);
r.get('/client_status', clientStatus);
r.get('/admin_summary', adminSummary);
r.get('/_debug/reservations', debugReservations);

export default r;
