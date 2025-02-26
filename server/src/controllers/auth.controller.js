const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma.config");

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username và mật khẩu là bắt buộc" });
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
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    delete user.password;

    res.status(200).json({ message: "Đăng nhập thành công", token, user });
  },
};

module.exports = authController;
