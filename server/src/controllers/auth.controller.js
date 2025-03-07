const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma.config");
const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username không được để trống",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu không được để trống",
  }),
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Token không được để trống",
  }),
});

const authController = {
  login: async (req, res) => {
    const { value, error } = loginSchema.validate(req.body);

    const { username, password } = value;

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = await prisma.users.findUnique({
      where: {
        username,
      },
      include: {
        tenants: true,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Username hoặc mật khẩu không đúng" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Username hoặc mật khẩu không đúng" });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    if (user.tenants) {
      payload.tenant_id = user.tenants.id;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    delete user.password;

    res
      .status(200)
      .json({ message: "Đăng nhập thành công", token, refreshToken, user });
  },

  refreshToken: async (req, res) => {
    const { value, error } = refreshTokenSchema.validate(req.body);

    const { token } = value;

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const secret = process.env.JWT_SECRET || "secret";

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Token không hợp lệ" });
      }

      const payload = {
        id: user.id,
        role: user.role,
      };

      if (user.tenant_id) {
        payload.tenant_id = user.tenant_id;
      }

      const newToken = jwt.sign(payload, secret, {
        expiresIn: "1h",
      });

      res.status(200).json({ token: newToken });
    });
  },
};

module.exports = authController;
