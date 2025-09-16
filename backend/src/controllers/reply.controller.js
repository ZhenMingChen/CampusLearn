import * as svc from '../services/reply.service.js';
export const create = async (req,res,next)=>{ try{ const result = await svc.create(req.user.sub, req.params.topicId, req.body.content); res.status(201).json(result);}catch(e){ next(e);} };
