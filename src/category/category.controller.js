'use strict'

import Category from "./category.model.js"

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const saveC = async(req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Crear la instancia
        let category = new Category(data)
        //Guardar el curso en la DB
        await category.save()
        //Responder al usuario
        return res.send({message: `${category.name} saved successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error saving category'})
    }
}

export const deleteC = async(req, res) => {
    try {
        let { id } = req.params
        let deletedCategory = await Course.findOneAndDelete({_id: id})
        if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'})
        return res.send({message: `Course ${deletedCategory.name} deleted successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting category'})
    }
}

export const showCategory = async(req, res) => {
    try {
        let results = await Category.find();
        if(!results) return res.status(400).send({message:`Empty collection.`})
        return res.send({ results });
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Nothing to show'})
    }
}