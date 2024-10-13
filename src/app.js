import { ProductManager } from './dao/productManager.js';
import { CartManager } from './dao/cartManager.js';
import express from 'express';
import { router as productsRouter } from './routes/productsRouter.js';
import { router as cartsRouter } from './routes/cartsRouter.js';

const PORT = 8080
const app = express();

ProductManager.setPath("data/products.json")
CartManager.setPath("data/carts.json")

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

