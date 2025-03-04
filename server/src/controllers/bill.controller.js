const Joi = require("joi");
const prisma = require("../configs/prisma.config");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const STATUS = ["pending", "paid", "partially_paid", "overdue"];

const getListSchema = querySchema.keys({
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": "Trạng thái hóa đơn không hợp lệ",
    }),
});

const createSchema = Joi.object({
  contract_id: Joi.string().required().messages({
    "any.required": "Id hợp đồng không được bỏ trống",
  }),
  bill_month: Joi.date().required().messages({
    "any.required": "Tháng lập hóa đơn không được bỏ trống",
    "date.base": "Tháng lập hóa đơn không hợp lệ",
  }),
  due_date: Joi.date().required().messages({
    "any.required": "Hạn thanh toán không được bỏ trống",
    "date.base": "Hạn thanh toán không hợp lệ",
  }),
});

const updateSchema = Joi.object({
  bill_month: Joi.date().optional().messages({
    "date.base": "Tháng lập hóa đơn không hợp lệ",
  }),
  due_date: Joi.date().optional().messages({
    "date.base": "Hạn thanh toán không hợp lệ",
  }),
  room_fee: Joi.number().optional(),
  service_fee: Joi.number().optional(),
  total_amount: Joi.number().optional(),
  status: Joi.string()
    .valid(...STATUS)
    .optional()
    .messages({
      "any.only": "Trạng thái hóa đơn không hợp lệ",
    }),
});

const billController = {
  async getList(req, res) {
    const { value, error } = getListSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { page, limit, search, order, status } = value;

    if (!page) {
      const bills = await prisma.bills.findMany({
        where: {
          status,
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
        orderBy: order,
      });
      return res.json(bills);
    }

    const skip = (page - 1) * limit;

    const bills = await prisma.bills.findMany({
      where: { status },
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
      skip,
      take: limit,
    });

    const total = await prisma.bills.count({
      where: {
        status,
      },
    });

    res.json({
      bills,
      page,
      limit,
      total,
    });
  },
  async create(req, res) {
    const { error, value } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const [contract, services] = await Promise.all([
      await prisma.contracts.findUnique({
        where: { id: value.contract_id },
        include: {
          rooms: true,
        },
      }),
      prisma.services.findMany(),
    ]);

    const service_fee = services.reduce(
      (total, service) => total + service.unit_price,
      0
    );

    const room_fee = contract.rooms.price;
    const total_amount = service_fee + room_fee;

    const bill = await prisma.bills.create({
      data: {
        ...value,
        service_fee,
        room_fee,
        total_amount,
        status: "pending",
      },
    });

    res.status(201).json({ message: "Tạo hóa đơn thanh công", bill });
  },
  async update(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const bill = await prisma.bills.update({
      where: {
        id,
      },
      data: value,
    });

    res.json({
      message: "Cập nhật hóa đơn thành công",
      bill,
    });
  },
  async delete(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    await prisma.bills.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Xóa hóa đơn thanh công",
    });
  },
};

module.exports = billController;
