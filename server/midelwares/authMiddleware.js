const jwt = require("jsonwebtoken");
const { Signups } = require("../modules/db.js");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.settoken;
    if (!token) return res.status(401).json({ message: "No token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    req.user = await Signups.findById(decoded.userID).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
