'use strict'

import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { Router } from "express"
import { deleteP, get, save, updateP, search, test } from "./product.controller.js"

const api = Router()

api.get('/test',[validateJwt, isAdmin], test)
api.get('/get', get)
api.post('/save',[validateJwt, isAdmin], save)
api.put('/update/:id',[validateJwt, isAdmin], updateP)
api.delete('/deleteProduct/:id',[validateJwt, isAdmin], deleteP)
api.post('/search', search)


export default api

