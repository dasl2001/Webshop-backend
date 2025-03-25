const Express = require("express");

const {
  getCategories,
  addCategory,
} = require("../controllers/category.controller");

const categoriesRouter = Express.Router();

categoriesRouter.get("/", getCategories);
categoriesRouter.post("/new", addCategory);

module.exports = categoriesRouter;