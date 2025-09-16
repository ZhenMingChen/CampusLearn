import * as svc from '../services/file.service.js';
export const upload = async (req,res,next)=>{ try{ const { file } = req; const record = await svc.saveLocal(file); res.status(201).json(record);}catch(e){ next(e);} };
