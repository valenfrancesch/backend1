import fs from "fs"
import { ProductManager } from "./productManager.js";

export class CartManager{
    static #path=""

    static setPath(rutaArchivo=""){
        this.#path=rutaArchivo;
    }

    static async getCarts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        }else{
            return []
        }
    }

    static async #saveFile(datos=""){
        if(typeof datos!="string"){
            throw new Error(`invalid argument`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }

    static async addCart(products=[]){ 
        let carts=await this.getCarts()
        let id=1
        if(carts.length>0){
            id=Math.max(...carts.map(d=>d.id))+1
        }

        let newCart={
            id, 
            products
        }
        carts.push(newCart)
        await this.#saveFile(JSON.stringify(carts, null, 5))

        return newCart
    }

    static async getCartById(id) {
        let carts = await this.getCarts()
        let cart = carts.find(e => e.id == id)
        if (!cart) {
            console.log("Not found")
            return;
        }
        return cart
    }

    static async addProductToCart(cid, pid){
        let products = ProductManager.getProducts();
        if(!products.find(p=>p.id==pid)){
            console.log("pid does not exist in DB")
            return;
        }
        let carts = await this.getCarts()
        let cartIndex = carts.findIndex(c => c.id == cid);
        if (cartIndex < 0) {
            console.log("cart not found")
            return;
        }
        let cart = carts[cartIndex]
        const productIndex = cart.products.findIndex(pr => pr.product == pid);
        if(productIndex < 0) {
            cart.products.push({
                product: pid,
                quantity: 1
            })
        }else{
            cart.products[productIndex].quantity++
        }
        carts[cartIndex] = cart
        await this.#saveFile(JSON.stringify(carts, null, 5))
        return cart
    }
}