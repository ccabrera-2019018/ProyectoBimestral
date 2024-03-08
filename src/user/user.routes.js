import express from "express";
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { deleteU, getPurchaseHistory, login, register, registerAdmin, test, update } from "./user.controller.js";

const api = express.Router()

//RUTAS PUBLICAS
api.post('/register', register)
api.post('/login', login)


//RUTAS PRIVADAS (ADMIN)
api.get('/test',[validateJwt, isAdmin], test)
api.post('/registerAdmin',[validateJwt, isAdmin], registerAdmin)

//RUTAS PUBLICAS (CLIENT)
api.put('/update/:id',[validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteU)
api.get('/getPurchaseHistory', [validateJwt], getPurchaseHistory)

export default api