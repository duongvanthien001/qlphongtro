const prisma = require("../configs/prisma.config");

const roomController = {
  getList: async (req, res) => {
    const {
      page = 1,
      limit = 8,
      search = "",
      order = { id: "desc" },
    } = req.query;

    const skip = (page - 1) * limit;

    const orderBy = JSON.parse(order);

    const rooms = await prisma.rooms.findMany({
      skip,
      take: parseInt(limit),
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        tenants: true,
        contracts: true,
        owners: true,
      },
      orderBy,
    });

    const total = await prisma.rooms.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    res.json({
      page,
      limit,
      rooms,
      total,
    });
  },

  getById: async (req, res) => {
    const { id } = req.params;

    const room = await prisma.rooms.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        tenants: true,
        owners: true,
        contracts: true,
      },
    });

    res.json(room);
  },

  create: async (req, res) => {
    const { name, area, price, status } = req.body;
    const owner_id = req.user.id;

    const room = await prisma.rooms.create({
      data: {
        name,
        area: parseInt(area),
        price: parseInt(price),
        status,
        owner_id,
      },
    });

    res.json({ message: "Thêm phòng thành công", room });
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { name, area, price, status } = req.body;
    const owner_id = req.user.id;

    const room = await prisma.rooms.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        area: parseInt(area),
        price: parseInt(price),
        status,
        owner_id,
      },
    });

    res.json({ message: "Cập nhật phòng thành công", room });
  },

  delete: async (req, res) => {
    const { id } = req.params;

    await prisma.rooms.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ message: "Xóa phòng thành công" });
  },
};

module.exports = roomController;
