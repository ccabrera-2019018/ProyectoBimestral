'use strict'

import jwt from 'jsonwebtoken'
import ShoppingCart from "./shoppingCart.model.js"
import Product from "../products/product.model.js"
import Bill from "../bill/bill.model.js"


export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const createCart = async (req, res) => {
    try {
        // Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY;
        // Obtener el token de los headers
        let { authorization } = req.headers;

        // Verificar y decodificar el token JWT
        let { uid } = jwt.verify(authorization, secretKey);

        // Obtener los datos
        const { productId, quantity } = req.body;

        // Verificar si el producto existe y obtener su precio
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found.' });
        }

        // Verificar que quantity no se ingrese un número invalido
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).send({ message: 'Invalid quantity.' });
        }

        // Calcular el total
        const amountPayable = product.price * parsedQuantity;

        // Verificar si el carrito ya existe para este usuario
        let cart = await ShoppingCart.findOne({ userId: uid });
        // Si el carrito no existe, crear uno nuevo
        if (!cart) {
            cart = new ShoppingCart({
                userId: uid,
                items: [{ productId: product._id, quantity: parsedQuantity, price: product.price }],
                amountPayable
            });
        } else {
            // Si el carrito ya existe, agregar el producto
            cart.items.push({ productId: product._id, quantity: parsedQuantity, price: product.price });

            // Recalcular el total
            cart.amountPayable += amountPayable;
        }

        // Guardar el carrito
        await cart.save();

        //Responder al usuario si todo bien
        return res.send({ message: 'Product added to cart successfully.' });
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: err.message });
    }
};

export const removeProduct = async (req, res) => {
    try {
        // Obteniene el token
        let secretKey = process.env.SECRET_KEY;
        // Obtener el token de los headers
        let { authorization } = req.headers;

        // Verifica el token
        let { uid } = jwt.verify(authorization, secretKey);

        // Requiere el Id del producto para eliminar el producto
        const { productName } = req.params;

        // Buscar el carrito del usuario
        let cart = await ShoppingCart.findOne({ userId: uid });

        // Verifica la existencia del carrito
        if (!cart) {
            return res.status(404).json({ message: 'Shopping cart not found.' });
        }

        // Busca
        const index = cart.items.findIndex(item => item.productName === productName);

        // Verifica si el producto existe
        if (index === -1) {
            return res.status(404).json({ message: 'Selected product not found in cart.' });
        }

        // Obtiene el precio y lo elimina
        const productPrice = cart.items[index].price;

        // Aqui resta el producto eliminado
        cart.amountPayable -= productPrice;

        // Elimina definitivamente el producto
        cart.items.splice(index, 1);

        // Guardar el carrito actualizado
        await cart.save();

        res.status(200).json({ message: 'Selected product removed from cart successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const purchase = async (req, res) => {
    try {
        // Obtiene el token 
        let secretKey = process.env.SECRET_KEY
        // Obtener el token de los headers
        let { authorization } = req.headers

        // Verifica el token 
        let { uid } = jwt.verify(authorization, secretKey)

        // Obtiene el carrito y lo populate
        let cart = await ShoppingCart.findOne({ userId: uid }).populate('items.productId')

        // Verifica si el carrito no esta vacio
        if (!cart || cart.items.length === 0) {
            return res.status(400).send({ message: 'The shopping cart is empty.' })
        }

        // Calcular el total
        let amountPayable = 0;
        for (const item of cart.items) {
            amountPayable += item.quantity * item.productId.price
        }

        // Verifica si hay productos disponibles
        for (const item of cart.items) {
            const product = await Product.findById(item.productId)
            if (!product || product.quantity < item.quantity) {
                return res.status(400).send({ message: 'Insufficient stock for one or more products in the cart.' })
            }
        }

        // Actualizar los productos en el inventario
        const promises = [];
        for (const item of cart.items) {
            const product = await Product.findById(item.productId)
            product.stock -= item.quantity; // Restar cantidad
            product.sold += item.quantity; // Actualiza ventas
            promises.push(product.save()); // Guarda
        }
        await Promise.all(promises);

        // Crea la factura
        const bill = new Bill({
            userId: uid,
            items: cart.items,
            amountPayable
        });

        // Guarda
        await bill.save()

        // Vacia el carrito
        cart.items = []
        cart.amountPayable = 0
        await cart.save()

        // Devuelve la factura al Usuario
        return res.send({ message: 'Purchase completed successfully.', bill })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
