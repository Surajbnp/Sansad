import jwt from "jsonwebtoken";

function verifyUser(token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "sansadappsecret"
    );
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

export default verifyUser;
