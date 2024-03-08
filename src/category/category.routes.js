'use strict'

import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js";
import { Router } from "express"
import { deleteC, saveC, showCategory, update } from "./category.controller.js"

const api = Router()

api.post('/save',[validateJwt, isAdmin], saveC)
api.delete('/deleteC/:id',[validateJwt, isAdmin], deleteC)
api.get('/showCategory', showCategory)
api.put('/update/:id', [validateJwt, isAdmin], update)

export default api