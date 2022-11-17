import { createError } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("verifyToken...");

  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log("verify... err: ", err);
      return next(createError(403, "Token is not valid!"));
    }
    console.log("req.user: ", req.user);
    req.user = user;
    console.log("req.user: ", req.user);
    next();
  });
};

export const verifyUser = (req, res, next) => {
  console.log("verifyUser...");

  verifyToken(req, res, next, () => {
    console.log("req.user.id: ", req.user.id);
    console.log("req.params.id: ", req.params.id);
    console.log("req.user.isAdmin: ", req.user.isAdmin);
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  console.log("verifyAdmin...");

  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
