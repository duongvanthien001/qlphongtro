const prisma = require("../configs/prisma.config");

const analystController = {
  getAnalyst: async (req, res) => {
    const roomCount = await prisma.rooms.aggregate({
      _count: {
        id: true,
      },
    });

    const emptyRoomCount = await prisma.rooms.aggregate({
      _count: {
        id: true,
      },
      where: {
        status: "available",
      },
    });

    const peopleCount = await prisma.tenants.aggregate({
      _count: {
        id: true,
      },
    });

    res.json({
      room: roomCount._count.id,
      emptyRoom: emptyRoomCount._count.id,
      people: peopleCount._count.id,
    });
  },
};

module.exports = analystController;
