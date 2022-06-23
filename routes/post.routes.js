const route = require("express").Router();

const {getAll, getById, create, update, updateLike, remove}=require("../services/post.services")

route.get("/", getAll);
route.get("/:id", getById);
route.post("/", create);

route.put("/:id", update);
route.put("/:id/likes/:like",updateLike )
route.delete("/:id", remove)


module.exports = route;