'use strict'

import Product from '../products/product.model.js'
import Category from '../category/category.model.js'
import { checkUpdate } from '../utils/validator.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}
export const get = async (req, res) => {
    try {
        let products = await Product.find().populate('category', ['name']);
        return res.send({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error getting products.` });
    }
}

export const save = async(req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Crear la instancia
        let product = new Product(data)
        //Guardar el producto
        await product.save()
        //Responder al usuario
        return res.send({message: 'Product saved successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error saving product'})
    }
}

export const updateP = async(req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Capturar el id del producto a actualizar
        let { id } = req.params
        //Validar que tenga datos
        /*let update = checkUpdate(data, false)
        if(!update) return res.status(400).send({message: 'Have submitted some that cannot be updated or missinf data'})*/
        //Actualizar
        let updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedProduct) return res.status(404).send({message: 'Product not found and not updated'})
        //Responder al usuario
        return res.send({message: 'Product updated successfully', updatedProduct})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const deleteP = async(req, res) => {
    try {
        let { id } = req.params
        //Eliminar
        let deletedProduct = await Product.deleteOne({_id: id})
        //Validar que se eliminó
        if(!deletedProduct) return res.status(404).send({message: 'Product not found and not deleted'})
        //Responder al usuario
        return res.send({message: 'Deleted product successfully'})
    } catch (err) {
        console.error(err)
        return res.status(404).send({message: 'Error deleting product'})
    }
}

export const search = async(req, res) => {
    try {
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Buscar
        let products = await Product.find({name: { $regex: new RegExp(search, 'i')}}).populate('category', ['name', 'description'])
        //Validar la respuesta
        if(!products) return res.status(404).send({message: 'Product not found'})
        //Responder al usuario
        return res.send({message: 'Product found', products})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}

export const soldOut = async(req, res) => {
    try {
        let product = await Product.find({ stock: 0}).populate('category')
        return res.send({ product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting products out of stock.'})
    }
}

// Función de busqueda de los productos mas vendidos 
export const getMoreSold = async (req, res) => {
    try {
        // Obtener los productos con al menos una venta.
        const moreSold = await Product.find({ sold: { $gt: 0 } }).sort({ sales: -1 }).limit(10)
        
        // Productos mas vendidos
        const response = {
            message: 'Here are the products that have sold the most.',
            moreSold: moreSold
        }
        
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting the best selling products' })
    }
}

export const getProductCategory = async(req, res)=>{
    try {
        //obtenemos el id de la categoria
        let {id} = req.params;

        //validamos que exista la categoria
        let categoryFind = await Category.findOne({_id: id});
        if(!categoryFind) return res.status(404).send({message:`Category not found`});

        //buscamos los productos segun la categoria

        let productsFind = await Product.find({category: categoryFind._id}).populate({
            path: 'category',
            select: '-_id name'
        });
        
        return res.send({productsFind});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:`Error getting products by category | getProductCategory.`});
    }
}