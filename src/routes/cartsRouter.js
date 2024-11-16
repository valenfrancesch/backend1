import { Router } from "express";
import { processError } from "../utils.js";
import { CartManager } from "../dao/cartManager.js";
import { CartManagerMongo } from "../dao/cartManagerMongo.js";

export const router = Router()

router.post("/", async(req, res) => { 
    let {products} = req.body
    try {
        let carts=await CartManagerMongo.addCart(products)
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({carts});
    } catch (error) {
        processError(res, error)
    }
})

router.get("/:cid", async(req, res) => { 
    let {cid} = req.params
    try{
        let cart=await CartManagerMongo.getCartById(cid)
        
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
    try{
        let cart=await CartManagerMongo.addProductToCart(cid, pid)
        res.setHeader('Content-Type','application/json');
        if(!cart){
            return res.status(404).json({error: "Product or cart does not exist"});
        } 
        return res.status(201).json({cart});
    }catch(error){
        processError(res, error)
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    let {cid, pid} = req.params
    try{
        let cart=await CartManagerMongo.deleteProductFromCart(cid, pid)
        res.setHeader('Content-Type','application/json');
        if(!cart){
            return res.status(404).json({error: "Cart not found"});
        } 
        return res.status(201).json({cart});
    }catch(error){
        processError(res, error)
    }
})

router.put("/:cid ", async(req, res)=>{
    let {cid} = req.params
    let {products} = req.body
    res.setHeader('Content-Type','application/json');
    if(!Array.isArray(products)){
        return res.status(400).json({error: "Products must be an array"});
    }
    try{
        let cart=await CartManagerMongo.updateCartProducts(cid, products)
        if(!cart){
            return res.status(404).json({error: "Product or cart does not exist"});
        } 
        return res.status(201).json({cart});
    }catch(error){
        processError(res, error)
    }
})

router.put("/:cid/products/:pid", async(req, res)=>{
    let {cid, pid} = req.params
    let {quantity} = req.body
    quantity = Number(quantity)
    res.setHeader('Content-Type','application/json');
    if(isNaN(quantity)){
        return res.status(400).json({error: "Quantity must be a number"});
    }
    try{
        let cart=await CartManagerMongo.updateProductQuantity(cid, pid, quantity)
        if(!cart){
            return res.status(404).json({error: "Product or cart does not exist"});
        } 
        return res.status(201).json({cart});
    }catch(error){
        processError(res, error)
    }
})

router.delete("/:cid", async(req, res)=>{
    let { cid } = req.params

    try {
        let deletedProduct = await CartManagerMongo.clearCart(cid);
        res.setHeader('Content-Type', 'application/json');

        if (!deletedProduct) {
            return res.status(404).json({ error: `Cart not found` })
        }
        return res.status(201).json({ deletedProduct });
    } catch (error) {
        processError(res, error)
    }
})