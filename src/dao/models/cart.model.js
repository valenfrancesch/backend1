import mongoose from "mongoose";

export const cartModel = mongoose.model(
    "carts",
    new mongoose.Schema(
        {
            products: {
                type: [
                    {
                        //product: String,
                        product: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "products"
                        },
                        quantity: Number
                    }
                ]
            }
        },
        {
            timestamps: true
        }
    )
)