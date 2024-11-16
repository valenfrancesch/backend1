import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2";

let productSchema=new mongoose.Schema(
    {
        code: {
            type: String, 
            unique: true
        }, 
        title: String,
        descrip: String, 
        price: Number,
        status: String,
        category: String,
        thumbnail: [String], 
        stock: {
            type: Number, 
            default: 0
        }, 
    },
    {
        timestamps: true,
    }
)

productSchema.plugin(paginate)

export const productsModel=mongoose.model(
    "products",
    productSchema
)
