import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";

export const router = Router()

//Vistas
router.get("/products", async (req, res) => {
    let products = await ProductManager.getProducts()
    res.render("index", { products, style: "style.css" })
})

router.get("/realtimeproducts", async (req, res) => {
    let products = await ProductManager.getProducts()
    res.render("realTimeProducts", { products, style: "style.css" })
})
