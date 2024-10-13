import fs from "fs"
export class ProductManager {
    static #path = ""

    static setPath(rutaArchivo = "") {
        this.#path = rutaArchivo
    }

    static async #saveFile(datos = "") {
        if (typeof datos != "string") {
            throw new Error(`invalid argument`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }

    static async addProduct(title = null, description = null, code = null, price = null, status = null, stock = null, category = null, thumbnail = null) {
        let products = await this.getProducts()

        if (title === null || description === null || price === null || thumbnail === null || code === null || stock === null || category === null || status === null) {
            console.log("Por favor, complete todos los campos")
            return;
        }

        if (products.find(pr => pr.code == code)) {
            console.log("El código de producto ya existe. Intente con otro")
            return;
        }

        let id = 1
        if (products.length > 0) {
            id = Math.max(...products.map(d => d.id)) + 1
        }

        let p = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        products.push(p)
        await this.#saveFile(JSON.stringify(products, null, 5))
        return p
    }

    static async updateProduct(id = null, title = null, description = null, code = null, price = null, status = null, stock = null, category = null, thumbnail = null) {
       
        let products = await this.getProducts()
        const productIndex = products.findIndex(pr => pr.id == id);

        if (productIndex < 0) {
            console.log("Product not found")
            return;
        }

        // Update the product fields
        const productToUpdate = products[productIndex];

        if (title !== null) productToUpdate.title = title;
        if (description !== null) productToUpdate.description = description;
        if (price !== null) productToUpdate.price = price;
        if (status !== null) productToUpdate.status = status;
        if (stock !== null) productToUpdate.stock = stock;
        if (category !== null) productToUpdate.category = category;
        if (thumbnail !== null) productToUpdate.thumbnail = thumbnail;

        await this.#saveFile(JSON.stringify(products, null, 5));

        return productToUpdate; 
    }

    static async getProducts() {
        if (fs.existsSync(this.#path)) {
            return JSON.parse(await fs.promises.readFile(this.#path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }

    static async getProductById(id) {
        let products = await this.getProducts()
        let product = products.find(e => e.id == id)
        if (!product) {
            console.log("Not found")
            return;
        }
        return product
    }

    static async deleteProduct(id){
        let products = await this.getProducts()

        const productIndex = products.findIndex(product => product.id === id);
        const deletedProduct = products.splice(productIndex, 1); 

        await this.#saveFile(JSON.stringify(products, null, 5));
        return deletedProduct[0]; 
    }
}