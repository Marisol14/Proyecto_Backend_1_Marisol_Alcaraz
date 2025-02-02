import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/productos.json');

const productsRouter = Router();

// Función para leer productos
const readProducts = () => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// 📌 GET /api/products/ → Listar productos con opción de limitación
productsRouter.get('/', (req, res) => {
    try {
        const products = readProducts();
        const { limit } = req.query;
        res.json(limit ? products.slice(0, parseInt(limit)) : products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// 📌 GET /api/products/:pid → Obtener producto por ID
productsRouter.get('/:pid', (req, res) => {
    try {
        const products = readProducts();
        const product = products.find(p => p.id.toString() === req.params.pid);
        product ? res.json(product) : res.status(404).json({ message: 'Producto no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// 📌 POST /api/products/ → Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category)
            return res.status(400).json({ message: 'Todos los campos son obligatorios excepto thumbnails' });

        const products = readProducts();
        const newProduct = {
            id: Date.now().toString(),
            title, description, code, price, stock, category,
            status: true,
            thumbnails: thumbnails || []
        };
        products.push(newProduct);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// 📌 PUT /api/products/:pid → Modificar un producto por ID
productsRouter.put('/:pid', (req, res) => {
    try {
        const products = readProducts();
        const index = products.findIndex(p => p.id.toString() === req.params.pid);
        if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

        const { id, ...updatedFields } = req.body; // No permitir modificar ID
        products[index] = { ...products[index], ...updatedFields };
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        res.json(products[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// 📌 DELETE /api/products/:pid → Eliminar un producto por ID
productsRouter.delete('/:pid', (req, res) => {
    try {
        const products = readProducts();
        const newProducts = products.filter(p => p.id.toString() !== req.params.pid);
        if (products.length === newProducts.length)
            return res.status(404).json({ message: 'Producto no encontrado' });

        fs.writeFileSync(filePath, JSON.stringify(newProducts, null, 2));
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default productsRouter;

