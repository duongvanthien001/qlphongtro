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
  contract_id: Joi.number().required().messages({
    "any.required": "Id hợp đồng không được bỏ trống",
  }),
  electricity_index: Joi.number().required().messages({
    "any.required": "Chỉ số điện không được bỏ trống",
  }),
  water_index: Joi.number().required().messages({
    "any.required": "Chỉ số nước không được bỏ trống",
  }),
  include_garbage_fee: Joi.boolean().optional().messages({
    "boolean.base": "Bao gồm tiền rác không hợp lệ",
  }),
  due_date: Joi.date().required().messages({
    "any.required": "Hạn thanh toán không được bỏ trống",
    "date.base": "Hạn thanh toán không hợp lệ",
  }),
});

const updateSchema = Joi.object({
  due_date: Joi.date().optional().messages({
    "date.base": "Hạn thanh toán không hợp lệ",
  }),
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
              rooms: true,
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
            rooms: true,
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
  async getById(req, res) {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const bill = await prisma.bills.findUnique({
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
            rooms: true,
          },
        },
        service_usage: {
          include: {
            services: true,
          },
        },
      },
    });

    if (!bill) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    res.json(bill);
  },
  async create(req, res) {
    const { error, value } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const {
      electricity_index,
      water_index,
      include_garbage_fee,
      due_date,
      contract_id,
    } = value;

    const [contract, services] = await Promise.all([
      await prisma.contracts.findUnique({
        where: { id: contract_id },
        include: {
          rooms: true,
        },
      }),
      prisma.services.findMany(),
    ]);

    const service_fee = services.reduce((acc, service) => {
      if (service.name === "Điện") {
        return acc + service.unit_price.toNumber() * electricity_index;
      } else if (service.name === "Nước") {
        return acc + service.unit_price.toNumber() * water_index;
      } else if (service.name === "Internet") {
        return acc + service.unit_price.toNumber();
      } else if (service.name === "Rác" && include_garbage_fee) {
        return acc + service.unit_price.toNumber();
      }
      return acc;
    }, 0);

    const room_fee = contract.rooms.price.toNumber();
    const total_amount = room_fee + service_fee;

    const bill = await prisma.bills.create({
      data: {
        service_fee,
        room_fee,
        total_amount,
        status: "pending",
        due_date,
        contract_id,
      },
    });

    const service_usage_data = [
      {
        service_id: services.find((service) => service.name === "Điện").id,
        bill_id: bill.id,
        usage_amount: electricity_index,
      },
      {
        service_id: services.find((service) => service.name === "Nước").id,
        bill_id: bill.id,
        usage_amount: water_index,
      },
      {
        service_id: services.find((service) => service.name === "Internet").id,
        bill_id: bill.id,
        usage_amount: 1,
      },
    ];

    if (include_garbage_fee) {
      service_usage_data.push({
        service_id: services.find((service) => service.name === "Rác").id,
        bill_id: bill.id,
        usage_amount: 1,
      });
    }

    await prisma.service_usage.createMany({
      data: service_usage_data,
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
