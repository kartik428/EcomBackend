import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const otpStore = {};

// STEP 1: SEND OTP
export const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      accountType,
      companyName,
      gstin,
      companyAddress,
    } = req.body;

    //  basic validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone must be 10 digits",
      });
    }

    //  B2B validation
    if (accountType === "B2B") {
      if (!companyName || !companyAddress) {
        return res.status(400).json({
          message: "Company name and address required",
        });
      }
    }

    //  check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  cooldown check
    if (otpStore[email]) {
      const lastSent = otpStore[email].lastSent;
      if (Date.now() - lastSent < 30000) {
        return res.status(400).json({
          message: "Wait 30 seconds before requesting OTP again",
        });
      }
    }
    //  generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);

    //  store all data
    otpStore[email] = {
      name,
      email,
      password,
      phone,
      accountType,
      companyName,
      gstin,
      companyAddress,
      otp,
      lastSent: Date.now(),
      expiry: Date.now() + 5 * 60 * 1000,
    };

    //  send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });
    console.log("Signup API hit");
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// STEP 2: VERIFY OTP & CREATE USER
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (record.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(record.password, 10);

    //  create user
    const user = await User.create({
      name: record.name,
      email: record.email,
      phone: record.phone,
      password: hashedPassword,
      accountType: record.accountType || "B2C",
      companyName: record.companyName || null,
      gstin: record.gstin || null,
      companyAddress: record.companyAddress || null,
      isVerified: true,
    });

    //  cleanup
    delete otpStore[email];

    res.json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password, accountType } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase();

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    if (accountType && user.accountType !== accountType) {
      return res.status(400).json({
        message: `This is a ${user.accountType} account`,
      });
    }
    // check verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
    );

    res.json({
      message: "User Logged in",
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.json({
    data: users,
  });
};

export const createUser = async (req, res) => {
  try {
    const { accountType, name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      accountType,
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: true, 
    });

    res.json({
      message: "User created",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({ message: "User deleted" });
};
