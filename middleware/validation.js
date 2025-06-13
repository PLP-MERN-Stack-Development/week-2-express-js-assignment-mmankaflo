const ValidationError = require("../errors/ValidationError");

module.exports = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    typeof inStock !== "boolean"
  ) {
    return next(new ValidationError("Missing or invalid product fields"));
  }

  next();
};
