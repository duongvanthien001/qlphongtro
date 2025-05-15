const prisma = require("../configs/prisma.config");
const Joi = require("joi");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const TYPE = ["electricity", "water", "internet", "other"];

const getListSchema = querySchema.keys({
  type: Joi.string()
    .valid(...TYPE)
    .optional()
    .messages({
      "any.only": "Loại dịch vụ không hợp lệ",
    }),
});

const createSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên không được để trống",
  }),
  unit_price: Joi.number().required().messages({
    "number.base": "Giá theo đơn vị không hợp lệ",
  }),
  unit: Joi.string().required().messages({
    "string.empty": "Đơn vị không được để trống",
  }),
  type: Joi.string()
    .valid(...TYPE)
    .required()
    .messages({
      "any.only": "Loại dịch vụ không hợp lệ",
      "string.empty": "Loại dịch vụ không được để trống",
    }),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  unit_price: Joi.number().optional(),
  unit: Joi.string().optional(),
});

const serviceController = {
  async getList(req, res) {
    const { value, error } = getListSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { search, page, order, limit, type } = value;

    if (!page) {
      const services = await prisma.services.findMany({
        where: {
          name: {
            contains: search,
          },
          type,
        },
        orderBy: order,
      });

      return res.json(services);
    }

    const services = await prisma.services.findMany({
      where: {
        name: {
          contains: search,
        },
        type,
      },
      orderBy: order,
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.services.count({
      where: {
        name: {
          contains: search,
        },
        type,
      },
    });

    res.json({ services, total, page, limit });
  },

  async getById(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const service = await prisma.services.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    res.json(service);
  },

  async create(req, res) {
    const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const service = await prisma.services.create({
      data: value,
    });

    res.status(201).json({ message: "Thêm dịch vụ thành công", service });
  },

  async update(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);
    const { value, error } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const service = await prisma.services.update({
      where: {
        id,
      },
      data: value,
    });

    res.json({ message: "Cập nhật dịch vụ thành công", service });
  },

  async delete(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    await prisma.services.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Xóa dịch vụ thành công" });
  },
};

module.exports = serviceController;
