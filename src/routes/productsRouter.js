import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";
import { processError } from "../utils.js";

export const router = Router()

ProductManager.setPath("data/products.json")

router.get("/", async (req, res) => { 
    try {
        let products=await ProductManager.getProducts()
    
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({products});
    } catch (error) {
        processError(res, error)
    }
})

router.get("/:pid", async (req, res) => { 
    let {pid} = req.params
    pid = Number(pid)
    if(isNaN(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`id must be a number`})
    }

    try {
        let product=await ProductManager.getProductById(pid)

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({product});
    } catch (error) {
        processError(res, error)
    }
})

router.post("/", async (req, res) => { 
    let {title, description, code, price, status, stock, category, thumbnails} = req.body
    try {
        let products=await ProductManager.getProducts()
        let exists=products.find(p=>p.code.toLowerCase()==code.trim().toLowerCase())
        if(exists){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`${code} already exists in DB`})
        }

        let newProduct=await ProductManager.addProduct(title, description, code, price, status, stock, category, thumbnails); 

        res.setHeader('Content-Type','application/json');
        return res.status(201).json({newProduct});
    } catch (error) {
        processError(res, error)
    }
})

router.put("/:pid", async (req, res)=>{ 
    let {pid} = req.params
    pid = Number(pid)
    if(isNaN(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`id must be a number`})
    }

    let {title, description, code, price, status, stock, category, thumbnails} = req.body
    try {
        let products=await ProductManager.getProducts()
        let exists=products.find(p=>p.id==pid)
        if(!exists){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`${id} does not exist in DB`})
        }
        let updatedProduct=await ProductManager.updateProduct(pid, title, description, code, price, status, stock, category, thumbnails); 
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({updatedProduct});
    } catch (error) {
        processError(res, error)
    }
})

router.delete("/:pid", async(req, res)=>{ //DONE
    let {pid} = req.params
    pid = Number(pid)
    if(isNaN(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`id must be a number`})
    }

    try {
        let products=await ProductManager.getProducts()
        let exists=products.find(p=>p.id==pid)
        if(!exists){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`${code} does not exist in DB`})
        }
        let deletedProduct=await ProductManager.deleteProduct(pid); 
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({deletedProduct});
    } catch (error) {
        processError(res, error)
    }
})
