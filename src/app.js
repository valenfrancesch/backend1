import { ProductManager } from './dao/productManager.js';
import { CartManager } from './dao/cartManager.js';
import express from 'express';
import handlebars, { engine } from 'express-handlebars';
import { router as productsRouter } from './routes/productsRouter.js';
import { router as cartsRouter } from './routes/cartsRouter.js';
import { Server } from 'socket.io';
import { router as viewsRouter} from './routes/viewsRouter.js';
import mongoose from 'mongoose';
import { ProductManagerMongo } from './dao/productManagerMongo.js';
import { processError } from './utils.js';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';

const PORT = 8080
const app = express();

try{
    await mongoose.connect('mongodb+srv://valufrancesch:LuJjvclsA334ozVj@ecommerce.uvklo.mongodb.net/?retryWrites=true&w=majority&appName=eCommerce')
    console.log("Conexión a DB establecida.")
}catch(error){
    console.log(error)
    process.exit()
}

ProductManager.setPath("data/products.json")
CartManager.setPath("data/carts.json")

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"))

//Handlebars config
const hbs = exphbs.create({ //para que me deje accceder al product
    handlebars: Handlebars,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
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

    //Cuando llega para añadir un nuevo producto
    socket.on('addProduct', async productData => {
        console.log("llega la peticion nuevo producto")
        let { title, description, code, price, status, stock, category, thumbnails } = productData;
        try {
            let newProduct = await ProductManagerMongo.addProduct(title, description, code, price, status, stock, category, thumbnails);
            if (!newProduct) {
                socketServer.emit("error", { message: "Error in params" });
                return;
            }
            console.log("Argregado exitosamente")
            socket.emit("newProduct", { newProduct })
        } catch (error) {
            console.log(error)
            socket.emit("error", { message: "Error al agregar el producto" });
        }
    });

    //Cuando llega para eliminar un producto
    socket.on('deleteProduct', async productData => {
        let { pid } = productData
        console.log(`Pid to delete: ${pid}`)
        try {
            let deletedProduct = await ProductManagerMongo.deleteProduct(pid);
            if (deletedProduct) {
                socketServer.emit("productDeleted", deletedProduct)
            }
           
        } catch (error) {
            socketServer.emit("error", { message: "Error al eliminar el producto" });
        }
    })
})