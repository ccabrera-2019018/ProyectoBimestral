'use strict'

import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { Router } from "express"
import { deleteP, get, save, updateP, search, test, soldOut, getMoreSold } from "./product.controller.js"

const api = Router()

api.get('/test',[get, isAdmin], test)
api.get('/get', get)
api.get('/soldOut', [validateJwt], soldOut)
api.get('/getMoreSold',[validateJwt], getMoreSold)
api.post('/save',[validateJwt, isAdmin], save)
api.post('/search', search)
api.put('/update/:id',[validateJwt, isAdmin], updateP)
api.delete('/deleteProduct/:id',[validateJwt, isAdmin], deleteP)

export default api

