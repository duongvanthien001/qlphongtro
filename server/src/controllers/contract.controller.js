const Joi = require("joi");
const prisma = require("../configs/prisma.config");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const STATUS = ["active", "expired", "terminated"];

const getListSchema = querySchema.keys({
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": "Trạng thái hợp đồng không hợp lệ",
    }),
});

const createSchema = Joi.object({
  room_id: Joi.number().required().messages({
    "any.required": "Id phòng không được để trống",
  }),
  tenant_id: Joi.number().required().messages({
    "any.required": "Id người thuê không được để trống",
  }),
  start_date: Joi.date().required().messages({
    "any.required": "Ngày bắt đầu hợp đồngđồng không được để trống",
  }),
  end_date: Joi.date().required().messages({
    "any.required": "Ngày kết thúc hợp đồng không được để trống",
  }),
  deposit: Joi.number().required().messages({
    "any.required": "Tiền cọc không được để trống",
  }),
});

const updateSchema = Joi.object({
  room_id: Joi.string().optional(),
  tenant_id: Joi.string().optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  deposit: Joi.number().optional(),
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": "Trạng thái hợp đồng không hợp lệ",
    }),
});

const contractController = {
  async getList(req, res) {
    const { value, error } = getListSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { page, limit, order, status, search } = value;

    const where = {
      status,
    };

    if (search) {
      where.tenants = {
        users: {
          full_name: {
            contains: search,
          },
        },
      };
    }

    if (!page) {
      const contracts = await prisma.contracts.findMany({
        where,
        include: {
          tenants: {
            include: {
              users: true,
            },
          },
          rooms: true,
        },
        orderBy: order,
      });
      return res.json(contracts);
    }

    const skip = (page - 1) * limit;

    const contracts = await prisma.contracts.findMany({
      where,
      include: {
        tenants: {
          include: {
            users: true,
          },
        },
        rooms: true,
      },
      orderBy: order,
      take: limit,
      skip,
    });

    const total = await prisma.contracts.count({
      where,
    });

    res.json({ contracts, page, limit, total });
  },

  async getById(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const contract = await prisma.contracts.findUnique({
      where: {
        id,
      },
      include: {
        tenants: {
          include: {
            users: true,
          },
        },
        rooms: true,
      },
    });

    if (!contract) {
      return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
    }

    res.json(contract);
  },

  async create(req, res) {
    const { error, value } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contract = await prisma.contracts.create({
      data: value,
      include: {
        tenants: {
          include: {
            users: true,
          },
        },
        rooms: true,
      },
    });

    await prisma.rooms.update({
      where: {
        id: value.room_id,
      },
      data: {
        status: "occupied",
      },
    });

    res.status(201).json({ message: "Thêm hợp đồng thành công", contract });
  },

  async update(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);
    const { value, error } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contract = await prisma.contracts.update({
      where: {
        id,
      },
      data: value,
      include: {
        tenants: true,
        rooms: true,
      },
    });

    res.json({ message: "Cập nhật hợp đồng thành công", contract });
  },

  async delete(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const contract = await prisma.contracts.findUnique({
      where: {
        id,
      },
    });

    if (!contract) {
      return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
    }

    await Promise.all([
      prisma.contracts.delete({
        where: {
          id,
        },
      }),
      prisma.rooms.update({
        where: {
          id: contract.room_id,
        },
        data: {
          status: "available",
        },
      }),
    ]);

    res.json({
      message: "Xóa hợp đồng thành công",
    });
  },
};

module.exports = contractController;
