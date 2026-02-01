// migration-script.js
// 
// Este script migra los datos de las colecciones 'products' y 'categories'
// desde Google Firestore a una base de datos MongoDB.
//
// --- PREPARACIÓN ---
// 1. Asegúrate de tener un archivo .env en la raíz de la carpeta 'backend'
//    con las siguientes variables:
//
//    FIREBASE_SERVICE_ACCOUNT='...' (el contenido JSON de tu clave de servicio de Firebase)
//    MONGO_URI='mongodb://localhost:27017' (tu cadena de conexión de MongoDB)
//    MONGO_DB_NAME='barcia-ecom' (el nombre de la base de datos en MongoDB)
//
// 2. Instala las dependencias necesarias:
//    npm install mongodb dotenv
//
// 3. Ejecuta el script desde la raíz de tu proyecto:
//    node backend/migration-script.js
//

import 'dotenv/config.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { MongoClient } from 'mongodb';

// --- CONFIGURACIÓN ---
const { FIREBASE_SERVICE_ACCOUNT, MONGO_URI, MONGO_DB_NAME } = process.env;

if (!FIREBASE_SERVICE_ACCOUNT || !MONGO_URI || !MONGO_DB_NAME) {
  console.error("Error: Faltan variables de entorno. Asegúrate de que FIREBASE_SERVICE_ACCOUNT, MONGO_URI, y MONGO_DB_NAME estén definidas en tu archivo .env.");
  process.exit(1);
}

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);

// --- SCRIPT DE MIGRACIÓN ---

async function migrate() {
  // Inicializar Firebase
  const firebaseApp = initializeApp({
    credential: cert(serviceAccount)
  });
  const firestoreDb = getFirestore(firebaseApp);
  console.log('Conectado a Firebase.');

  // Inicializar MongoDB
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const mongoDb = mongoClient.db(MONGO_DB_NAME);
  console.log('Conectado a MongoDB.');

  try {
    // --- Migrar Colecciones ---
    const collectionsToMigrate = ['products', 'categories'];

    for (const collectionName of collectionsToMigrate) {
      console.log(`
Iniciando migración para la colección: "${collectionName}"...`);

      // 1. Leer de Firestore
      const snapshot = await firestoreDb.collection(collectionName).get();
      if (snapshot.empty) {
        console.log(`La colección "${collectionName}" en Firestore está vacía. Saltando.`);
        continue;
      }

      const documents = snapshot.docs.map(doc => ({
        ...doc.data(),
        // Opcional: Si quieres mantener el ID de Firestore, puedes guardarlo.
        // MongoDB generará su propio _id automáticamente.
        firestoreId: doc.id
      }));
      console.log(`Leídos ${documents.length} documentos de Firestore.`);

      // 2. Escribir en MongoDB
      // Borra la colección existente para evitar duplicados en ejecuciones repetidas
      try {
        await mongoDb.collection(collectionName).drop();
        console.log(`Colección "${collectionName}" existente en MongoDB eliminada.`);
      } catch (error) {
        if (error.codeName !== 'NamespaceNotFound') {
          throw error;
        }
        // Si la colección no existe, no hay problema.
      }

      const result = await mongoDb.collection(collectionName).insertMany(documents);
      console.log(`Insertados ${result.insertedCount} documentos en MongoDB.`);
      console.log(`Migración de "${collectionName}" completada.`);
    }

    console.log('\n¡Migración finalizada con éxito!');

  } catch (error) {
    console.error('\nOcurrió un error durante la migración:', error);
  } finally {
    // Cerrar conexión de MongoDB
    await mongoClient.close();
    console.log('\nDesconectado de MongoDB.');
    // Firebase no necesita desconexión explícita para scripts
  }
}

// Ejecutar la función principal
migrate();
