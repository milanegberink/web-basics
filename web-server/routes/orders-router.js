import express from "express";
import * as orderController from "../controllers/order-controller.js";

export const router = express.Router();

router.get("/", orderController.listAll);

router.post("/", orderController.create);

router.get("/:id", orderController.getById);

router.delete("/:id", orderController.del);
