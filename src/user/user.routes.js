import express from "express";
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { deleteU, login, register, registerAdmin, test, update } from "./user.controller.js";

const api = express.Router()

api.get('/test',[validateJwt, isAdmin], test)
api.post('/register', register)
api.post('/registerAdmin',[validateJwt, isAdmin], registerAdmin)
api.post('/login', login)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteU)

export default api