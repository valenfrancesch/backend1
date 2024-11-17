import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";
import { ProductManagerMongo } from "../dao/productManagerMongo.js";
import { CartManagerMongo } from "../dao/cartManagerMongo.js";

export const router = Router()

//Vistas
router.get("/", async (req, res) => {
    let {page, limit} = req.query
    page=Number(page)
    limit=Number(limit)
    if(isNaN(page)) page=1
    if(isNaN(limit))limit=10

    let {payload, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage} = await ProductManagerMongo.getProducts(limit, page)
    res.render("index", { products:payload, 
        totalPages, 
        hasNextPage, 
        hasPrevPage, 
        nextPage, 
        prevPage,
        style: "style.css" })
})

router.get("/products", async (req, res) => {
    let {page, limit} = req.query
    page=Number(page)
    limit=Number(limit)
    if(isNaN(page)) page=1
    if(isNaN(limit))limit=10

    let {payload, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage} = await ProductManagerMongo.getProducts(limit, page)
    res.render("index", { products:payload, 
        totalPages, 
        hasNextPage, 
        hasPrevPage, 
        nextPage, 
        prevPage,
        style: "style.css" })
})

router.get("/realtimeproducts", async (req, res) => {
    let products = await ProductManagerMongo.getProducts()
    res.render("realTimeProducts", { products, style: "style.css" })
})

router.get("/carts/:cid", async (req, res) => {
    const {cid} = req.params
    let {products} = await CartManagerMongo.getCartById(cid)
    res.render("cart", { products, style: "style.css" })
})

router.get("/nocart", async (req, res) => {
    res.render("noCart", {style: "style.css" })
})

