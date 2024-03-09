'use strict'

import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { Router } from "express"
import { deleteP, get, save, updateP, search, test, soldOut, getMoreSold, getProductCategory } from "./product.controller.js"

const api = Router()


//RTAS PUBLICAS
api.get('/test',[get, isAdmin], test)
api.get('/get', get)
api.get('/soldOut', [validateJwt], soldOut)
api.get('/getMoreSold',[validateJwt], getMoreSold)
api.get('/byCategory/:id', [validateJwt], getProductCategory)
api.post('/search', search)

// RUTAS PRIVADAS (ADMIN)
api.post('/save',[validateJwt, isAdmin], save)
api.put('/update/:id',[validateJwt, isAdmin], updateP)
api.delete('/deleteProduct/:id',[validateJwt, isAdmin], deleteP)

export default api

