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
  getReport: async (req, res) => {
    const totalIncome = await prisma.payments.aggregate({
      _sum: {
        amount: true,
      },
    });

    const totalDebt =
      await prisma.$queryRaw`SELECT SUM(total_amount - p.total_payment) as total FROM bills, (SELECT COALESCE(SUM(amount), 0) as total_payment FROM payments) p`;

    const totalElectricity =
      await prisma.$queryRaw`SELECT SUM(s.unit_price * su.usage_amount) as total FROM services s LEFT JOIN service_usage su ON s.id = su.service_id WHERE s.name = 'Điện'`;

    const totalWater =
      await prisma.$queryRaw`SELECT SUM(s.unit_price * su.usage_amount) as total FROM services s LEFT JOIN service_usage su ON s.id = su.service_id WHERE s.name = 'Nước'`;

    res.json({
      totalIncome: totalIncome._sum.amount,
      totalDebt: totalDebt[0].total,
      totalElectricity: totalElectricity[0].total,
      totalWater: totalWater[0].total,
    });
  },
};

module.exports = analystController;
