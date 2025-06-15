import express from "express";
import * as productController from "../controllers/product-controller.js";

export const router = express.Router();

router.get("/", productController.listAll);

router.post("/", productController.create);

router.get("/:id", productController.getById);

router.delete("/:id", productController.del);

router.put("/:id", productController.update);
