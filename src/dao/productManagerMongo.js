import fs from "fs"
import { productsModel } from "./models/products.model.js"
import paginate from "mongoose-paginate-v2"

export class ProductManagerMongo {

    static async addProduct(title = null, description = null, code = null, price = null, status = null, stock = null, category = null, thumbnail = null) {
        let {payload} = await this.getProducts()

        if (title === null || description === null || price === null || thumbnail === null || code === null || stock === null || category === null || status === null) {
            console.log("Por favor, complete todos los campos")
            return null;
        }

        if (payload.find(pr => pr.code == code)) {
            console.log("El código de producto ya existe. Intente con otro")
            return null;
        }

        let p = {
            title,
            description,
            price,
            status,
            category,
            thumbnail,
            code,
            stock
        }

        let newProduct = await productsModel.create(p)
        return newProduct.toJSON()
    }

    static async updateProduct(id = null, title = null, description = null, code = null, price = null, status = null, stock = null, category = null, thumbnail = null) {

        const productToUpdate = {}

        if (title !== null) productToUpdate.title = title;
        if (description !== null) productToUpdate.description = description;
        if (price !== null) productToUpdate.price = price;
        if (status !== null) productToUpdate.status = status;
        if (stock !== null) productToUpdate.stock = stock;
        if (category !== null) productToUpdate.category = category;
        if (thumbnail !== null) productToUpdate.thumbnail = thumbnail;

        return await productsModel.findByIdAndUpdate(id, productToUpdate, { new: true }).lean()
    }

    static async getProducts(limit = 10, page = 1, sort = null, query = null) {
        const filter = query ? { $or: [{ category: query }, { status: query }] } : {}; // Filtro por categoría o disponibilidad.
        const options = {
            limit: limit,
            page: page,
            sort: sort ? { price: sort } : undefined,
            lean: true
        };

        const result = await productsModel.paginate(filter, options);

        const prevLink = result.hasPrevPage
            ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort || ''}&query=${query || ''}`
            : null;

        const nextLink = result.hasNextPage
            ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort || ''}&query=${query || ''}`
            : null;

        return {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        };
    }

    static async getProductById(id) {
        return await productsModel.findOne({ _id: id }).lean()
    }

    static async getProductBy(filter) {
        return await productsModel.findOne(filter).lean()
    }

    static async deleteProduct(id) {
        console.log("delete")
        console.log(id)
        return await productsModel.findByIdAndDelete(id).lean()
    }
}