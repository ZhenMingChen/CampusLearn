import * as svc from '../services/reply.service.js';

export const create = async (req, res, next) => {
  try {
    const result = await svc.create(
      req.user.sub,            // userId from JWT
      req.params.topicId,      // topic being replied to
      req.body.content         // reply content
    );
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
