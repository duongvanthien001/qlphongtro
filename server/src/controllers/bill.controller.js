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
  month: Joi.number().optional().messages({
    "number.base": "Tháng không hợp lệ",
  }),
  year: Joi.number().optional().messages({
    "number.base": "Năm không hợp lệ",
  }),
  tenant_id: Joi.number().optional().messages({
    "number.base": "Id người thuê không hợp lệ",
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
  service_ids: Joi.array().items(Joi.number()).optional().messages({
    "array.base": "Mảng dịch vụ không hợp lệ",
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
  created_at: Joi.date().optional().messages({
    "date.base": "Ngày tạo hóa đơn không hợp lệ",
  }),
});

const billController = {
  async getList(req, res) {
    const { value, error } = getListSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { page, limit, search, order, status, month, year, tenant_id } =
      value;

    const where = {
      status,
    };

    if (search) {
      where.contracts = {
        tenants: {
          users: {
            full_name: {
              contains: search,
            },
          },
        },
      };
    }

    if (tenant_id) {
      where.contracts = {
        tenant_id,
      };
    }

    const newMonth = month || new Date().getMonth() + 1;

    if (month) {
      where.created_at = {
        gte: new Date(year || new Date().getFullYear(), month - 1, 1),
        lt: new Date(year || new Date().getFullYear(), month, 1),
      };
    }

    if (year) {
      where.created_at = {
        gte: new Date(year, newMonth - 1, 1),
        lt: new Date(year + 1, newMonth, 1),
      };
    }

    if (!page) {
      const bills = await prisma.bills.findMany({
        where,
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
          payments: true,
        },
        orderBy: order,
      });
      return res.json(bills);
    }

    const skip = (page - 1) * limit;

    const bills = await prisma.bills.findMany({
      where,
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
        payments: true,
      },
      orderBy: order,
      skip,
      take: limit,
    });

    const total = await prisma.bills.count({
      where,
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
        payments: true,
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
      due_date,
      contract_id,
      service_ids,
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
      if (service.type === "electricity") {
        return acc + service.unit_price.toNumber() * electricity_index;
      } else if (service.type === "water") {
        return acc + service.unit_price.toNumber() * water_index;
      } else if (service.type === "internet") {
        return acc + service.unit_price.toNumber();
      }
      return service_ids.includes(service.id)
        ? acc + service.unit_price.toNumber()
        : acc;
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
        service_id: services.find((service) => service.type === "electricity")
          .id,
        bill_id: bill.id,
        usage_amount: electricity_index,
      },
      {
        service_id: services.find((service) => service.type === "water").id,
        bill_id: bill.id,
        usage_amount: water_index,
      },
      {
        service_id: services.find((service) => service.type === "internet").id,
        bill_id: bill.id,
        usage_amount: 1,
      },
    ];

    if (service_ids.length) {
      service_ids.forEach((service_id) => {
        service_usage_data.push({
          service_id,
          bill_id: bill.id,
          usage_amount: 1,
        });
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

    if (bill.status === "pending") {
      await prisma.payments.deleteMany({
        where: {
          bill_id: id,
        },
      });
    }

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
