const Joi = require("joi");
const prisma = require("../configs/prisma.config");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const STATUS = ["pending", "in_progress", "completed"];

const getListSchema = querySchema.keys({
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": "Trạng thái hóa đơn không hợp lệ",
    }),
  tenant_id: Joi.number().optional(),
});

const createSchema = Joi.object({
  room_id: Joi.number().required().messages({
    "any.required": "Id phòng không được bỏ trống",
  }),
  tenant_id: Joi.number().required().messages({
    "any.required": "Id người thuê không được bỏ trống",
  }),
  description: Joi.string().optional(),
});

const updateSchema = Joi.object({
  description: Joi.string().optional(),
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": "Trạng thái bảo trì không hợp lệ",
    }),
  resolved_date: Joi.date()
    .optional()
    .messages({
      "date.base": "Ngày giải quyết không hợp lệ",
    })
    .allow(null),
  request_date: Joi.date().optional().messages({
    "date.base": "Ngày yêu cầu không hợp lệ",
  }),
});

const maintenancesController = {
  getList: async (req, res) => {
    const { value, error } = getListSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { page, limit, search, status, tenant_id } = value;

    const where = {
      tenants: {
        users: {
          full_name: {
            contains: search,
          },
        },
      },
      status,
    };

    if (tenant_id) {
      where.tenant_id = tenant_id;
    }

    if (!page) {
      const maintenances = await prisma.maintenances.findMany({
        where,
        include: {
          rooms: true,
          tenants: {
            include: {
              users: true,
            },
          },
        },
      });
      return res.json(maintenances);
    }

    const skip = (page - 1) * limit;

    const maintenances = await prisma.maintenances.findMany({
      skip,
      take: limit,
      where,
      include: {
        rooms: true,
        tenants: {
          include: {
            users: true,
          },
        },
      },
    });

    const total = await prisma.maintenances.count({
      where,
    });

    res.json({ maintenances, total, page, limit });
  },

  getById: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const maintenances = await prisma.maintenances.findUnique({
      where: {
        id,
      },
      include: {
        rooms: true,
        tenants: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!maintenances) {
      return res.status(404).json({ message: "Không tìm thấy bảo trì" });
    }

    res.json(maintenances);
  },

  create: async (req, res) => {
    const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const maintenances = await prisma.maintenances.create({
      data: value,
      include: {
        rooms: true,
        tenants: {
          include: {
            users: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Thêm bảo trì thành công",
      maintenances,
    });
  },
  update: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (value.status === "completed" && !value.resolved_date) {
      value.resolved_date = new Date();
    }

    const maintenance = await prisma.maintenances.update({
      where: {
        id,
      },
      data: value,
      include: {
        rooms: true,
        tenants: {
          include: {
            users: true,
          },
        },
      },
    });

    res.json({
      message: "Cập nhật bảo trì thành công",
      maintenance,
    });
  },
  delete: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    await prisma.maintenances.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Xóa bảo trì thành công",
    });
  },
};

module.exports = maintenancesController;
