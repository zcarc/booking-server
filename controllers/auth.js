import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = (req, res, next) => {
  try {
    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(myPlaintextPassword, salt, async function (err, hash) {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash,
        });

        await newUser.save();

        res.status(200).send("User has been created.");
      });
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  console.log("req.body.username: ", req.body.username);
  try {
    const user = await User.findOne({ username: req.body.username });

    console.log("### user: ", user);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const myPlaintextPassword = req.body.password;
    const hash = user.password;

    bcrypt.compare(
      myPlaintextPassword,
      hash,
      function (err, isPasswordCorrect) {
        console.log("isPasswordCorrect: ", isPasswordCorrect);
        if (!isPasswordCorrect) {
          return next(createError(400, "Wrong password or username!"));
        }

        const { password, isAdmin, ...otherDetails } = user._doc;
        console.log("...otherDetails: ", { ...otherDetails });

        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY
        );

        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json({ ...otherDetails });
      }
    );
  } catch (error) {
    next(error);
  }
};
