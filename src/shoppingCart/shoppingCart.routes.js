import express from "express";
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { createCart, purchase, removeProduct } from "./shoppingCart.controller.js";

const api = express.Router()

api.post('/create', [validateJwt], createCart)
api.delete('/removeProduct', [validateJwt], removeProduct)
api.post('/purchase', [validateJwt], purchase)

export default api