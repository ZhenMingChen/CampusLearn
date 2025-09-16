import Joi from 'joi';
export const createTopicSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(3).required(),
    assigneeId: Joi.string().allow(null,'')
  })
});
