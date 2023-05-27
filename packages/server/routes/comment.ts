import express from 'express';
import type { Express } from 'express';
import { commentCreate, commentGet, commentUpdate, commentDelete } from '../controllers/comment';
import { PREFIX } from '../config/contants';

const commentRoutes = function (app: Express) {
  app.use(express.json());

  app.post(`${PREFIX}/comments`, [commentCreate]);
  app.get(`${PREFIX}/comments`, [commentGet]);
  app.get(`${PREFIX}/comments/:topic_id`, [commentGet]);
  app.put(`${PREFIX}/comments/:id`, [commentUpdate]);
  app.delete(`${PREFIX}/comments/:id`, [commentDelete]);
};

export default commentRoutes;
