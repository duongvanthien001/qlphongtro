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
      await prisma.$queryRaw`SELECT SUM(b.total_amount - COALESCE(p.total_payment,0)) total FROM bills b LEFT JOIN (SELECT bill_id, SUM(amount) total_payment FROM payments GROUP BY bill_id) p ON b.id = p.bill_id`;

    const totalElectricity =
      await prisma.$queryRaw`SELECT SUM(s.unit_price * su.usage_amount) as total FROM services s LEFT JOIN service_usage su ON s.id = su.service_id WHERE s.name = 'Điện'`;

    const totalWater =
      await prisma.$queryRaw`SELECT SUM(s.unit_price * su.usage_amount) as total FROM services s LEFT JOIN service_usage su ON s.id = su.service_id WHERE s.name = 'Nước'`;

    const oldestYearOfBill = await prisma.bills.findFirst({
      select: {
        created_at: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    res.json({
      totalIncome: totalIncome._sum.amount,
      totalDebt: totalDebt[0].total,
      totalElectricity: totalElectricity[0].total,
      totalWater: totalWater[0].total,
      oldestYearOfBill: oldestYearOfBill
        ? oldestYearOfBill.created_at.getFullYear()
        : new Date().getFullYear(),
    });
  },
};

module.exports = analystController;
