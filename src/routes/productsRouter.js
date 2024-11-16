import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";
import { processError } from "../utils.js";
import { ProductManagerMongo } from "../dao/productManagerMongo.js";

export const router = Router()

router.get("/", async (req, res) => {
    let { limit, page, sort, query } = req.query;

    limit = Number(limit) || 10;
    page = Number(page) || 1;
    sort = sort === "asc" ? 1 : sort === "desc" ? -1 : null;

    try {
        const response = await ProductManagerMongo.getProducts(limit, page, sort, query);
        response = {
            products: response.docs,
            ...response
        };

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(response);
    } catch (error) {
        processError(res, error);
    }
});

router.get("/:pid", async (req, res) => {
    let {pid} = req.params
    try {
        let product = await ProductManagerMongo.getProductById(pid)
        if (!product) {
            return res.status(404).json({ error: "Product does not exist in DB" });
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ product });
    } catch (error) {
        processError(res, error)
    }
})

router.post("/", async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body
    try {
        let newProduct = await ProductManagerMongo.addProduct(title, description, code, price, status, stock, category, thumbnails);
        res.setHeader('Content-Type', 'application/json');
        if (!newProduct) {
            return res.status(400).json({ error: "Error in params" });
        }
        return res.status(201).json({ newProduct });
    } catch (error) {
        processError(res, error)
    }
})

router.put("/:pid", async (req, res) => {
    let { pid } = req.params

    let { title, description, code, price, status, stock, category, thumbnails } = req.body
    try {
        let updatedProduct = await ProductManagerMongo.updateProduct(pid, title, description, code, price, status, stock, category, thumbnails);
        res.setHeader('Content-Type', 'application/json');
        if (!updatedProduct) {
            return res.status(404).json({ error: `${id} does not exist in DB` })
        }
        return res.status(201).json({ updatedProduct });
    } catch (error) {
        processError(res, error)
    }
})

router.delete("/:pid", async (req, res) => { 
    let { pid } = req.params

    try {
        let deletedProduct = await ProductManagerMongo.deleteProduct(pid);
        res.setHeader('Content-Type', 'application/json');

        if (!deletedProduct) {
            return res.status(404).json({ error: `${code} does not exist in DB` })
        }
        return res.status(201).json({ deletedProduct });
    } catch (error) {
        processError(res, error)
    }
})
