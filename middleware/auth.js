module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; 
  if (token !== "your-secret-token") {
    return res.status(403).json({ error: "Invalid token" });
  }

  next(); 
};
