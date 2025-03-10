const Joi = require("joi");
const prisma = require("../configs/prisma.config");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const PAYMENT_METHOD = ["cash", "bank_transfer"];

const getListSchema = querySchema.keys({
  payment_method: Joi.string()
    .valid(...PAYMENT_METHOD)
    .optional()
    .messages({
      "any.only": "Phương thức thanh toán không hợp lệ",
    }),
});

const createSchema = Joi.object({
  bill_id: Joi.number().required().messages({
    "any.required": "Id hóa đơn không được bỏ trống",
  }),
  amount: Joi.number().required().messages({
    "any.required": "Số tiền không được bỏ trống ",
  }),
  payment_method: Joi.string()
    .valid(...PAYMENT_METHOD)
    .required()
    .messages({
      "any.required": "Phương thức thanh toán không được bỏ trống",
      "any.only": "Phương thức thanh toán không hợp lệ",
    }),
});

const updateSchema = Joi.object({
  amount: Joi.number().optional(),
  payment_method: Joi.string()
    .valid(...PAYMENT_METHOD)
    .optional()
    .messages({
      "any.only": "Phương thức thanh toán không hợp lệ",
    }),
  payment_date: Joi.date().optional().messages({
    "date.base": "Ngày thanh toán không hợp lệ",
  }),
});

const paymentController = {
  getList: async (req, res) => {
    const { value, error } = getListSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { page, limit, order, payment_method } = value;

    if (!page) {
      const payments = await prisma.payments.findMany({
        where: {
          payment_method,
        },
        include: {
          bills: true,
        },
        orderBy: order,
      });
      return res.json(payments);
    }

    const payments = await prisma.payments.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        payment_method,
      },
      include: {
        bills: true,
      },
      orderBy: order,
    });

    const total = await prisma.payments.count({ where: { payment_method } });

    res.json({ payments, total, page, limit });
  },
  getById: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const payment = await prisma.payments.findUnique({
      where: { id },
      include: {
        bills: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    }

    res.json(payment);
  },
  create: async (req, res) => {
    const { error, value } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const bill = await prisma.bills.findUnique({
      where: { id: value.bill_id },
      include: {
        payments: true,
      },
    });

    if (!bill) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    const totalPaid = bill.payments.reduce(
      (acc, payment) => acc + payment.amount.toNumber(),
      0
    );

    const newAmount = totalPaid + value.amount;

    if (newAmount > bill.total_amount) {
      return res
        .status(400)
        .json({ message: "Số tiền thanh toán không được lớn hơn tổng tiền" });
    }

    const payment = await prisma.payments.create({
      data: value,
      include: {
        bills: true,
      },
    });

    await prisma.bills.update({
      where: { id: value.bill_id },
      data: {
        status:
          newAmount === bill.total_amount.toNumber()
            ? "paid"
            : "partially_paid",
      },
    });

    res.status(201).json({ message: "Thanh toán thành công", payment });
  },
  update: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);
    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const payment = await prisma.payments.update({
      where: { id },
      data: value,
    });

    res.json({ message: "Cập nhật thanh toán thành công", payment });
  },
  delete: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const payment = await prisma.payments.delete({
      where: {
        id,
      },
    });

    const payments = await prisma.payments.findMany({
      where: {
        bill_id: payment.bill_id,
      },
    });

    await prisma.bills.update({
      where: { id: payment.bill_id },
      data: {
        status: payments.length === 0 ? "pending" : "partially_paid",
      },
    });

    res.json({ message: "Xóa thanh toán thành công" });
  },
};

module.exports = paymentController;
