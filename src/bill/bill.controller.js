'use strict'

import Bill from "./bill.model.js"
import User from "../user/user.model.js"
import Product from "../products/product.model.js"
import PDFDocument from "pdfkit"
import fs from "fs"

export const getBill = async (req, res) => {
    try {
        const { billIds } = req.params;

        // Verificar si las facturas existen
        const bill = await Bill.find({ _id: { $in: billIds } }).populate('items.productId').populate('userId');

        if (bill.length === 0) {
            return res.status(404).json({ message: 'No invoices found for the provided IDs.' });
        }

        // Creamos un nuevo documento pdf
        const doc = new PDFDocument();

        // Aqui escribe en el pdf
        bill.forEach((bill, index) => {
            // Todo el encabezado de la factura
            doc.text(`Factura #${bill._id}`);
            doc.text(`Fecha de Creación: ${bill.createdAt}`);
            // Verificar si bill.userId existe 
            if (bill.userId) {
                doc.text(`Cliente: ${bill.userId.name} ${bill.userId.surname}`);
            } else {
                doc.text('Cliente: Nombre del cliente no disponible');
            }
            doc.moveDown(); 

            // Detalles de los product lo metimos dentro de una tabla
            doc.moveDown();
            doc.text('Detalles de los productos:');
            doc.moveDown();

            // Obtiene los detalles de los productos
            bill.items.forEach((item) => {
                doc.text(`${item.productId.name}: ${item.quantity} x Q ${item.price.toFixed(2)} = Q ${(item.quantity * item.price).toFixed(2)}`);
            });

            // Total de la factura
            doc.text(`Total Factura: Q ${bill.amountPayable.toFixed(2)}`);
            doc.moveDown(); 
            doc.text('Gracias por su compra. ¡Regrese pronto!', { align: 'center' });

            // Agregar espacio menos la ultima 
            if (index < bill.length - 1) {
                doc.addPage() // Si es demasiado grande la info. agrega otra pag.
            }
        });

        // Guarda el documento PDF
        doc.end();

        // Aqui enviamos el archivo PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=facturas_usuario.pdf');
        doc.pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obtaining bil.' });
    }
};