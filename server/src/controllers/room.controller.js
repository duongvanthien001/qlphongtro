const prisma = require("../configs/prisma.config");
const Joi = require("joi");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const STATUS = ["available", "occupied", "maintenance"];

const getListSchema = querySchema.keys({
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": "Trạng thái phòng không hợp lệ",
    }),
  tenant_id: Joi.number().optional().messages({
    "number.base": "ID người thuê không hợp lệ",
  }),
});

const createSchema = Joi.object({
  room_number: Joi.string().required().messages({
    "any.required": "Số phòng không được để trống",
    "string.empty": "Số phòng không được để trống",
  }),
  area: Joi.number().min(1).required().messages({
    "any.required": "Diện tích không được để trống",
    "number.min": "Diện tích phòng không hợp lệ",
  }),
  price: Joi.number().min(1).required().messages({
    "any.required": "Giá phòng không được để trống",
    "number.min": "Giá phòng không hợp lệ",
  }),
  status: Joi.string()
    .valid(...STATUS)
    .required()
    .messages({ "any.only": "Trạng thái phòng không hợp lệ" }),
  description: Joi.string().optional().allow(""),
});

const updateSchema = Joi.object({
  room_number: Joi.string().optional(),
  area: Joi.number().optional(),
  price: Joi.number().optional(),
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({ "any.only": "Trạng thái phòng không hợp lệ" }),
  description: Joi.string().optional(),
});

const roomController = {
  getList: async (req, res) => {
    const { value, error } = getListSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { page, limit, search, order, status, tenant_id } = value;

    const where = {
      room_number: {
        contains: search,
      },
      status,
    };

    if (tenant_id) {
      where.contracts = {
        some: {
          tenant_id,
        },
      };
    }

    if (!page) {
      const rooms = await prisma.rooms.findMany({
        where,
        include: {
          contracts: {
            include: {
              tenants: {
                include: {
                  users: true,
                },
              },
            },
          },
        },
        orderBy: order,
      });

      return res.json(rooms);
    }

    const skip = (page - 1) * limit;

    const rooms = await prisma.rooms.findMany({
      skip,
      take: limit,
      where,
      include: {
        contracts: {
          include: {
            tenants: {
              include: {
                users: true,
              },
            },
          },
        },
      },
      orderBy: order,
    });

    const total = await prisma.rooms.count({
      where,
    });

    res.json({
      page,
      limit,
      rooms,
      total,
    });
  },

  getById: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const room = await prisma.rooms.findUnique({
      where: {
        id,
      },
      include: {
        contracts: {
          include: {
            tenants: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    res.json(room);
  },

  create: async (req, res) => {
    const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const room = await prisma.rooms.create({
      data: value,
    });

    res.json({ message: "Thêm phòng thành công", room });
  },

  update: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);
    const { value, error } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const room = await prisma.rooms.update({
      where: {
        id,
      },
      data: value,
      include: {
        contracts: {
          include: {
            tenants: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });

    res.json({ message: "Cập nhật phòng thành công", room });
  },

  delete: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const room = await prisma.rooms.findUnique({
      where: {
        id,
      },
    });

    if (room.status === "occupied") {
      return res.status(400).json({
        message: "Không thể xóa phòng đang có người thuê",
      });
    }

    await prisma.rooms.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Xóa phòng thành công" });
  },
};

module.exports = roomController;
