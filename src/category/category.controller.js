'use strict'

import Category from "./category.model.js"
import Product from "../products/product.model.js"

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

export const update = async(req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Capturar el id del producto a actualizar
        let { id } = req.params
        //Validar que tenga dato
        //Actualizar
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCategory) return res.status(404).send({message: 'Product not found and not updated'})
        //Responder al usuario
        return res.send({message: 'Product updated successfully', updatedCategory})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const deleteC = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscamos la categoria que vamos a eliminar
        const deletedCategory = await Category.findById(id);

        // Verificamos si existe la categoria
        if (!deletedCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }

        // Aqui esta la categoria default
        const defaultCategory = await Category.findOne({ name: 'Default' });

        // Hace una busqueda de todos los productos si tiene relacion con la categoria
        const productsToUpdate = await Product.find({ categoryId: id });

            // Si eliminamos la categoria por default guarda a los productos
            await Promise.all(productsToUpdate.map(async (product) => {
                product.categoryId = defaultCategory._id;
                await product.save();
            }));

        // Elimina la categoría
        await Category.findByIdAndDelete(id);

        return res.send({ message: 'Deleted Category successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting category' });
    }
};

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