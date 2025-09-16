export const validate = schema => (req, res, next) => {
  const src = { body: req.body, params: req.params, query: req.query };
  const { error, value } = schema.validate(src, { abortEarly: false, allowUnknown: true });
  if (error) return res.status(400).json({ error: { message: 'Validation failed', details: error.details } });
  Object.assign(req, value);
  next();
};
