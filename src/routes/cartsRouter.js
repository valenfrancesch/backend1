import { Router } from "express";
import { processError } from "../utils.js";
import { CartManager } from "../dao/cartManager.js";

export const router = Router()

CartManager.setPath("data/products.json")

router.post("/", async(req, res) => { 
    let {products} = req.body
    try {
        let carts=await CartManager.addCart(products)
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({carts});
    } catch (error) {
        processError(res, error)
    }
})

router.get("/:cid", async(req, res) => { 
    let {cid} = req.params
    cid = Number(cid)
    if(isNaN(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`id must be a number`})
    }
    try{
        let cart=await CartManager.getCartById(cid)
        
        res.setHeader('Content-Type','application/json');
        if(!cart){
            return res.status(404).json({error:"The cart does not exist in DB"});
        }
        return res.status(200).json({cart});
    }catch(error){
        processError(res, error)
    }
})

router.post("/:cid/product/:pid", async(req, res) => { 
    let {cid, pid} = req.params
    cid = Number(cid)
    if(isNaN(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`pid must be a number`})
    }
    pid=Number(pid)
    if(isNaN(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`cid must be a number`})
    }
    try{
        let cart=await CartManager.addProductToCart(cid, pid)
        res.setHeader('Content-Type','application/json');
        if(!cart){
            return res.status(404).json({error: "Product or cart does not exist"});
        } 
        return res.status(200).json({cart});
    }catch(error){
        processError(res, error)
    }
})