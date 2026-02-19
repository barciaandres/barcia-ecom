import 'dotenv/config';
import mongoose from 'mongoose';
import ProductModel from '../models/product.model.js';

const MONGODB_URI = process.env.MONGODB_URI;

const updateProducts = async () => {
    if (!MONGODB_URI) {
        console.error('Error: La variable de entorno MONGODB_URI no está definida.');
        process.exit(1);
    }

    try {
        console.log('Conectando a la base de datos...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conexión exitosa.');

        console.log('Actualizando productos...');
        const result = await ProductModel.updateMany(
            { deleted: { $exists: false } }, // Filtro para documentos sin el campo 'deleted'
            { $set: { deleted: false } }      // Actualización para añadir el campo
        );

        console.log('Operación completada.');
        console.log(`- Documentos encontrados que necesitaban actualización: ${result.matchedCount}`);
        console.log(`- Documentos actualizados exitosamente: ${result.modifiedCount}`);

    } catch (error) {
        console.error('Ocurrió un error durante el proceso:', error);
    } finally {
        console.log('Cerrando conexión con la base de datos.');
        await mongoose.disconnect();
        console.log('Conexión cerrada.');
        process.exit(0);
    }
};

updateProducts();
