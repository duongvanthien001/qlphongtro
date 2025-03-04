const prisma = require("../configs/prisma.config");
const Joi = require("joi");
const { querySchema, paramsSchema } = require("../schemas/index.schema");

const tenantController = {
  async getList(req, res) {
    const { value } = querySchema.validate(req.query);

    const { page, limit, search, order } = value;

    if (!page) {
      const tenants = await prisma.tenants.findMany({
        where: {
          users: {
            OR: [
              {
                full_name: {
                  contains: search,
                },
              },
              {
                email: {
                  contains: search,
                },
              },
              {
                phone: {
                  contains: search,
                },
              },
              {
                username: {
                  contains: search,
                },
              },
            ],
          },
        },
        include: {
          users: true,
          contracts: {
            include: {
              rooms: true,
            },
          },
        },
        orderBy: order,
      });
      return res.json(tenants);
    }

    const skip = (page - 1) * limit;

    const tenants = await prisma.tenants.findMany({
      where: {
        users: {
          OR: [
            {
              full_name: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
            {
              username: {
                contains: search,
              },
            },
          ],
        },
      },
      include: {
        users: true,
        contracts: {
          include: {
            rooms: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: order,
    });

    const total = await prisma.tenants.count({
      where: {
        users: {
          OR: [
            {
              full_name: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
            {
              username: {
                contains: search,
              },
            },
          ],
        },
      },
    });

    res.json({ tenants, total, page, limit });
  },
};

module.exports = tenantController;
