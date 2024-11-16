import fs from "fs"
import { ProductManager } from "./productManager.js";
import { cartModel } from "./models/cart.model.js";
import { ProductManagerMongo } from "./productManagerMongo.js";

export class CartManagerMongo{

    static async getCarts(){
        return await cartModel.find().lean()
    }

    static async addCart(products=[]){ 
        let newCart=await cartModel.create({products})
        return newCart.toJSON()
    }

    static async getCartById(id) {
        return cartModel.findOne({ _id: id }).populate("products.product").lean();
    }

    static async addProductToCart(cid, pid){
        let product = await ProductManagerMongo.getProductById(pid)
        let cart = await this.getCartById(cid)
        if(!product){
            console.log("pid does not exist in DB")
            return null;
        }
        if (!cart) {
            console.log("cart not found")
            return null;
        }
        const productIndex = cart.products.findIndex(pr => pr.product._id.toString() == pid);
        console.log(productIndex)
        if(productIndex < 0) {
            cart.products.push({
                product: pid,
                quantity: 1
            })
        }else{
            cart.products[productIndex].quantity++
        }
        return await cartModel.findByIdAndUpdate(cid, cart, {new:true})
    }

    static async deleteProductFromCart(cid, pid) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            console.log("cart not found");
            return null;
        }
        console.log(pid)
        cart.products = cart.products.filter(pr => pr._id != pid);
        return await cartModel.findByIdAndUpdate(cid, cart, { new: true });
    }

    static async updateCartProducts(cid, products) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            console.log("cart not found");
            return null;
        }
        const validProducts = [];
        for (const product of products) {
            const productExists = await ProductManagerMongo.getProductById(product.product);
            if (productExists) {
                validProducts.push(product);
            } else {
                console.log(`Product with id ${product.product} does not exist and will not be added.`);
            }
        }

        cart.products = validProducts;
        return await cartModel.findByIdAndUpdate(cid, cart, { new: true });
    }

    static async updateProductQuantity(cid, pid, quantity) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            console.log("cart not found");
            return null;
        }

        const productIndex = cart.products.findIndex(pr => pr.product._id.toString() == pid);
        if (productIndex < 0) {
            console.log("product not found in cart");
            return null;
        }

        cart.products[productIndex].quantity = quantity;
        return await cartModel.findByIdAndUpdate(cid, cart, { new: true });
    }

    static async clearCart(cid) {
        let cart = await this.getCartById(cid);
        if (!cart) {
            console.log("cart not found");
            return null;
        }
        cart.products = [];
        return await cartModel.findByIdAndUpdate(cid, cart, { new: true });
    }
}