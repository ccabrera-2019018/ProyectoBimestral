// Levantar servidor HTTP (express)
//ESModules
'use strict'

//Importaciones
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import userRoutes from '../src/user/user.routes.js'
import productRoutes from '../src/products/product.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import shoppingCartRoutes from '../src/shoppingCart/shoppingCart.routes.js'
import billRoutes from '../src/bill/bill.routes.js'

//Configuraciones
config();
const app = express()
const port = process.env.PORT || 3056

//Configuracin del servidor
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors()) //Aceptar o denegar solicitudes de diferentes origenes (local, remota) / politicas de acceso
app.use(helmet()) //Aplica capa de seguridad basica al servidor
app.use(morgan('dev')) //Logs de solicitudes al servidor HTTP

//Declaracion 
app.use('/user', userRoutes)
app.use('/product', productRoutes)
app.use('/category', categoryRoutes)
app.use('/shoppingCart', shoppingCartRoutes)
app.use('/bill', billRoutes)

//Levantar el servidor
export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${(port)}`)
}