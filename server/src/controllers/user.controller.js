const prisma = require("../configs/prisma.config");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const ROLES = ["admin", "staff", "tenant"];

const createSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({ "any.required": "Username không được để trống" }),
  full_name: Joi.string()
    .required()
    .messages({ "any.required": "Họ tên không được để trống" }),
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email không được để trống",
  }),
  phone: Joi.string()
    .required()
    .messages({ "any.required": "Số điện thoại không được để trống" }),
  password: Joi.string()
    .required()
    .messages({ "any.required": "Mật khẩu không được để trống" }),
  role: Joi.string()
    .valid(...ROLES)
    .required()
    .messages({
      "any.only": "Vai trò không hợp lệ",
      "any.required": "Vai trò không được để trống",
    }),
  date_of_birth: Joi.when("role", {
    is: "tenant",
    then: Joi.date().required().messages({
      "any.required": "Ngày sinh của người thuê không được bỏ trống",
      "date.base": "Ngày sinh của người thuê không hợp lệ",
    }),
    otherwise: Joi.date().optional(),
  }),
  id_card: Joi.when("role", {
    is: "tenant",
    then: Joi.string()
      .required()
      .messages({ "any.required": "CCCD/CMND không được để trống" }),
    otherwise: Joi.string().optional(),
  }),
  address: Joi.string().optional().allow(""),
});

const getListSchema = querySchema.keys({
  role: Joi.string()
    .valid(...ROLES)
    .optional()
    .messages({ "any.only": "Vai trò không hợp lệ" }),
});

const updateSchema = Joi.object({
  username: Joi.string().optional(),
  full_name: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Email không hợp lệ",
  }),
  role: Joi.string()
    .valid(...ROLES)
    .optional()
    .messages({ "any.only": "Vai trò không hợp lệ" }),
  phone: Joi.string().optional(),
  password: Joi.string().optional(),
  id_card: Joi.string().optional(),
  date_of_birth: Joi.date().optional(),
  address: Joi.string().optional(),
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string()
    .required()
    .messages({ "any.required": "Mật khẩu cũ không được để trống" }),
  new_password: Joi.string().required().messages({
    "any.required": "Mật khẩu mới không được để trống",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Mật khẩu xác nhận không trùng khớp",
      "any.required": "Mật khẩu xác nhận không được để trống",
    }),
});

const userController = {
  create: async (req, res) => {
    const { error, value } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ username: value.username }, { email: value.email }],
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "Username hoặc email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(value.password, 12);

    const { id_card, address, date_of_birth, ...userData } = value;

    if (value.role === "tenant") {
      const tenant = await prisma.tenants.create({
        data: {
          id_card,
          address,
          date_of_birth,
          users: {
            create: {
              ...userData,
              password: hashedPassword,
            },
          },
        },
        include: {
          users: {
            omit: {
              password: true,
            },
          },
        },
      });

      return res.status(201).json({
        tenant,
        message: "Thêm người thuê thành công",
      });
    }

    const newUser = await prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ user: newUser, message: "Thêm người dùng thành công" });
  },

  getList: async (req, res) => {
    const { value } = getListSchema.validate(req.query);

    const { page, limit, search, order, role } = value;

    if (!page) {
      const users = await prisma.users.findMany({
        where: {
          username: {
            contains: search,
          },
          role,
        },
        orderBy: order,
        omit: { password: true },
        include: {
          tenants: {
            include: {
              contracts: {
                include: {
                  rooms: true,
                },
              },
            },
          },
        },
      });
      return res.json(users);
    }

    const skip = (page - 1) * limit;

    const users = await prisma.users.findMany({
      where: {
        username: {
          contains: search,
        },
        role,
      },
      orderBy: order,
      skip,
      take: limit,
      omit: { password: true },
      include: {
        tenants: {
          include: {
            contracts: {
              include: {
                rooms: true,
              },
            },
          },
        },
      },
    });

    const total = await prisma.users.count({
      where: {
        username: {
          contains: search,
        },
        role,
      },
    });

    res.status(200).json({ users, total, page, limit });
  },

  getCurrent: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.user);

    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
      include: {
        tenants: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(user);
  },

  getById: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
      include: {
        tenants: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(user);
  },

  update: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);
    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { id_card, date_of_birth, address, ...userData } = value;

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    const user = await prisma.users.update({
      where: {
        id,
      },
      data: {
        ...userData,
        tenants: {
          update: {
            id_card,
            date_of_birth,
            address,
          },
        },
      },
      omit: { password: true },
      include: {
        tenants: true,
      },
    });

    res.status(200).json({ user, message: "Cập nhật thành công" });
  },

  updateProfile: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.user);
    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { id_card, date_of_birth, address, ...userData } = value;

    const user = await prisma.users.update({
      where: {
        id,
      },
      data: {
        ...userData,
        tenants: {
          update: {
            id_card,
            date_of_birth,
            address,
          },
        },
      },
      omit: { password: true },
      include: {
        tenants: true,
      },
    });

    res.status(200).json({ user, message: "Cập nhật thành công" });
  },

  changePassword: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.user);
    const { error, value } = changePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    const isMatch = await bcrypt.compare(value.old_password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    const hashedPassword = await bcrypt.hash(value.new_password, 12);

    await prisma.users.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  },

  delete: async (req, res) => {
    const {
      value: { id },
    } = paramsSchema.validate(req.params);

    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        tenants: {
          include: {
            contracts: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    await prisma.users.delete({
      where: {
        id,
      },
    });

    if (user.tenants) {
      const roomIds = user.tenants.contracts.map(
        (contract) => contract.room_id
      );

      await prisma.rooms.updateMany({
        where: {
          id: {
            in: roomIds,
          },
        },
        data: {
          status: "available",
        },
      });
    }

    res.status(200).json({ message: "Xóa thành công" });
  },
};

module.exports = userController;
