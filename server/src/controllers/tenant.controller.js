const prisma = require("../configs/prisma.config");

const tenantController = {
  async getAll(req, res) {
    const tenants = await prisma.tenants.findMany({
      include: {
        rooms: true,
      },
    });
    res.json(tenants);
  },
};

module.exports = tenantController;
