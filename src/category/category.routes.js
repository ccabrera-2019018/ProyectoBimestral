'use strict'

import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { Router } from "express"
import { deleteC, saveC, showCategory } from "./category.controller.js"

const api = Router()

api.post('/saveC',[validateJwt, isAdmin], saveC)
api.delete('/deleteC/:id',[validateJwt, isAdmin], deleteC)
api.get('/showCategory', showCategory)

export default api