import { Router } from 'itty-router'

import { Position, PositionApply, PositionCreate, PositionEdit, PositionDelete, Application } from './handlers/positions';
const router = Router()

router
  .get('/api/positions', Position)
  .get('/api/positions/:id', Position)
  .post('/api/positions/:id', PositionApply)
  .get('/api/positions/:id/applications', Application)
  .patch('/api/positions/:id', PositionEdit)
  .put('/api/positions/', PositionCreate)
  .delete('/api/positions/:id', PositionDelete)
  .get('*', () => new Response("Not found", { status: 404 }))

export const handleRequest = (request: Request): Promise<Response> => router.handle(request)

