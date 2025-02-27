const prisma = require("../configs/prisma.config");
const bcrypt = require("bcrypt");

const userController = {
  create: async (req, res) => {
    const { username, email, password, role, tenant } = req.body;

    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền tất cả các trường" });
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "Username hoặc email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        tenant_id: tenant,
      },
    });

    res
      .status(201)
      .json({ user: newUser, message: "Thêm tài khoản thành công" });
  },

  getList: async (req, res) => {
    const { page = 1, limit = 8, search = "", order = {} } = req.query;

    const skip = (page - 1) * limit;

    const orderBy = JSON.parse(order);

    const users = await prisma.users.findMany({
      where: {
        username: {
          contains: search,
        },
      },
      orderBy,
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.users.count({
      where: {
        username: {
          contains: search,
        },
      },
    });

    res.status(200).json({ users, total, page, limit });
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username,
        email,
        role,
      },
    });

    res.status(200).json({ user, message: "Cập nhật thành công" });
  },

  delete: async (req, res) => {
    const { id } = req.params;

    await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: "Xóa thành công" });
  },
};

module.exports = userController;
