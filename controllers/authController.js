const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  // Kiểm tra mật khẩu có trùng khớp không
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    // Tạo token đăng nhập
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '72h' }
    );

    // Trả về phản hồi thành công
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    // Kiểm tra lỗi trùng lặp khóa MongoDB (E11000)
    if (error.code === 11000 && error.keyValue.username) {
      return res.status(400).json({ message: 'Username đã tồn tại' });
    }
    if (error.code === 11000 && error.keyValue.email) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    // Lỗi khác
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('email: ', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!!!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '72h' }
    );
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
