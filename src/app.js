import { ProductManager } from './dao/productManager.js';
import { CartManager } from './dao/cartManager.js';
import express from 'express';
import handlebars, { engine } from 'express-handlebars';
import { router as productsRouter } from './routes/productsRouter.js';
import { router as cartsRouter } from './routes/cartsRouter.js';
import { Server } from 'socket.io';
import { router as viewsRouter} from './routes/viewsRouter.js';

const PORT = 8080
const app = express();

ProductManager.setPath("data/products.json")
CartManager.setPath("data/carts.json")

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"))

//Handlebars config
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

//Routers
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("", viewsRouter)


const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const socketServer = new Server(server)

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado")

    const emitAllProducts = async () => {
        let products = await ProductManager.getProducts()
        socket.emit("products", { products })
    }

    socket.on('addProduct', async productData => {
        console.log("llega la peticion nuevo producto")
        let { title, description, code, price, status, stock, category, thumbnails } = productData;
        try {
            let newProduct = await ProductManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
            if (!newProduct) {
                socketServer.emit("error", { message: "Error in params" });
                return;
            }
            console.log("Argregado exitosamente")
            socket.emit("newProduct", { newProduct })
        } catch (error) {
            socket.emit("error", { message: "Error al agregar el producto" });
        }
    });

    socket.on('deleteProduct', async productData => {
        let { pid } = productData
        console.log(pid)
        try {
            let deletedProduct = await ProductManager.deleteProduct(pid);
            if (deletedProduct) {
                socketServer.emit("productDeleted", deletedProduct)
            }
           
        } catch (error) {
            socketServer.emit("error", { message: "Error al eliminar el producto" });
        }
    })
})