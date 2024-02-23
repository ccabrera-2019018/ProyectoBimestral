'use strict'

import { response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'

export const validateJwt = async(req, res, next) => {
    try {
        //Obtener la llae de acceso al token
        let secretKey = process.env.SECRET_KEY
        //Pbtener el token de los headers
        let { token } = req.headers
        console.log(token)
        //Verificar si viene el token
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        //Obtener el uid del ususario que se envio el token
        let { uid } = jwt.verify(token, secretKey)
        console.log(uid)
        //Validar si el usuario aun existe
        let user = await User.findOne({_id: uid})
        if(!user) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.user = user
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({message: 'Invalid token'})
    }
}

export const isAdmin = async(req, res, next) => {
    try {
        let { user } = req
        if(!user || user.role !== 'ADMIN') return res.status(403).send({message: `You dont have access | username: ${user.username}`})
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).send({message: 'Unathorized role'})
    }
}