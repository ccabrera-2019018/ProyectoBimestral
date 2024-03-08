import express from 'express'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js' 
import { getBill } from './bill.controller.js';


const api = express.Router();


// Rutas de Factura Privadas 
api.get('/getBill/:billIds', [validateJwt, isAdmin], getBill)

export default api