'use strict'

import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const registerAdmin = async(req, res)=>{
    try {
        //Captturar el foormulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        //data.role = 'CLIENT'
        //Guardar la informacion en a DB
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})

    }
}

export const register = async(req, res)=>{
    try {
        //Captturar el foormulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la informacion en a DB
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})

    }
}

export const login = async(req, res) => {
    try {
        //Capturar los datos (body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username}) //buscar un solo registro. username: 'ccabrera'
        //Verifico que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generar Token
            let token = await generateJwt(loggedUser)
            //Responder al usuario
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser, token})
        }
        return res.status(404).send({message: 'Invalid credential'})
    } catch (error) {
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res) => {
    try {
        //Obtener el id del usuario a actulizar
        let { id } = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submit some data that cannot be update or missing data'})
        //Validar si tiene permisos (tokenización)
        //Actualizar (DB)
        let updatedUser = await User.findOneAndUpdate(
            {_id: id}, //Objects <- hexadecimales (Hora sys, Version Mongo, Llaver privada...) asi guarda mongoDB los ID
            data, //Los datos que se van a actualizar
            {new: true} //Objeto de la DB ya actualizado
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        //Respondo el usuario
        return res.send({message: 'Updated user', updatedUser}) 
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteU = async(req, res) => {
    try {
        //Obtener el Id
        let { id } = req.params
        //Validar si esta logeado y es el mismo
        //Eliminar (deleteOne / FindOneAndDelete)
        let deletedUser = await User.findOneAndDelete({_id: id})
        //Verificar que se elimino
        if(!deletedUser) return res.status(404).send({message: 'Account no found and not deleted'})
        //Responder
    return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting accout'})
    }
}

export const createAdmin = async () => {
    try {
        let user = await User.findOne({ username: 'ccabrera' });
        if (!user) {
            console.log('Creating user...')
            let admin = new User({
                name: 'Carlos',
                surname: 'Carlitos',
                username: 'ccabrera',
                password: '12345',
                email: 'ccabrera@kinal.org.gt',
                phone: '87654321',
                role: 'ADMIN'
            });
            admin.password = await encrypt(admin.password);
            await admin.save();
            return console.log({ message: `Registered successfully. \nCan be logged with username ${admin.username}` })
        }
        console.log({ message: `Can be logged with username ${user.username}` });

    } catch (err) {
        console.error(err);
        return err;
    }
}