const Joi = require("joi");

const querySchema = Joi.object().keys({
  page: Joi.number().optional(),
  limit: Joi.number().optional().default(8),
  search: Joi.string().optional().allow("").default(""),
  order: Joi.string()
    .optional()
    .custom((value, helpers) => {
      try {
        const [field, order] = value.split(":");
        if (!["asc", "desc"].includes(order)) {
          return helpers.error("any.invalid");
        }
        return { [field]: order };
      } catch (e) {
        return helpers.error("any.invalid");
      }
    })
    .default({ id: "desc" }),
});

const paramsSchema = Joi.object().keys({
  id: Joi.number()
    .required()
    .messages({ "any.required": "ID không được để trống" }),
});

module.exports = { querySchema, paramsSchema };
