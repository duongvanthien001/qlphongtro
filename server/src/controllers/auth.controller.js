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

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    delete user.password;

    res
      .status(200)
      .json({ message: "Đăng nhập thành công", token, refreshToken, user });
  },
};

module.exports = authController;
