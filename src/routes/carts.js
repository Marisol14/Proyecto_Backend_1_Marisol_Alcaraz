import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/carts.json');

const cartsRouter = Router();

// 📌 Crear un nuevo carrito
cartsRouter.post('/', (req, res) => {
    console.log('📌 POST recibido en /api/carts'); 

    const carts = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));

    console.log('✅ Nuevo carrito creado:', newCart);
    res.status(201).json(newCart);
});

// 📌 Obtener todos los carritos
cartsRouter.get('/', (req, res) => {
    console.log('📌 GET recibido en /api/carts');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No hay carritos disponibles' });
    }

    const carts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(carts);
});

// 📌 Obtener un carrito por ID
cartsRouter.get('/:id', (req, res) => {
    console.log(`📌 GET recibido en /api/carts/${req.params.id}`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No hay carritos disponibles' });
    }

    const carts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const cart = carts.find(c => c.id.toString() === req.params.id);

    if (!cart) {
        console.log('❌ Carrito no encontrado');
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json(cart);
});

// 📌 Agregar un producto a un carrito (CORREGIDO ✅)
cartsRouter.post('/:id/product/:pid', (req, res) => {
    console.log(`📌 POST recibido en /api/carts/${req.params.id}/product/${req.params.pid}`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No hay carritos disponibles' });
    }

    const carts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const cartIndex = carts.findIndex(c => c.id.toString() === req.params.id);

    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const { pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Debes enviar una cantidad válida' });
    }

    const cart = carts[cartIndex];
    const existingProduct = cart.products.find(p => p.productId.toString() === pid.toString());

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ productId: pid.toString(), quantity });
    }

    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));
    console.log('✅ Producto agregado al carrito:', pid);
    res.status(201).json(cart);
});

// 📌 Actualizar la cantidad de un producto en el carrito
cartsRouter.put('/:id/product/:productId', (req, res) => {
    console.log(`📌 PUT recibido en /api/carts/${req.params.id}/product/${req.params.productId}`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No hay carritos disponibles' });
    }

    const carts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const cartIndex = carts.findIndex(c => c.id.toString() === req.params.id);

    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'La cantidad debe ser un número mayor a 0' });
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = quantity;
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));

    console.log('✅ Cantidad actualizada:', req.params.productId, 'Nueva cantidad:', quantity);
    res.json({ message: 'Cantidad actualizada', cart });
});

// 📌 Eliminar un producto de un carrito
cartsRouter.delete('/:id/product/:productId', (req, res) => {
    console.log(`📌 DELETE recibido en /api/carts/${req.params.id}/product/${req.params.productId}`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No hay carritos disponibles' });
    }

    const carts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const cartIndex = carts.findIndex(c => c.id.toString() === req.params.id);

    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    let cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));

    console.log('✅ Producto eliminado:', req.params.productId);
    res.json({ message: 'Producto eliminado', cart });
});

// 📌 Eliminar un carrito completo
cartsRouter.delete('/:id', (req, res) => {
    console.log(`📌 DELETE recibido en /api/carts/${req.params.id}`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No hay carritos disponibles' });
    }

    let carts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const newCarts = carts.filter(c => c.id.toString() !== req.params.id);

    if (carts.length === newCarts.length) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    fs.writeFileSync(filePath, JSON.stringify(newCarts, null, 2));

    console.log('✅ Carrito eliminado:', req.params.id);
    res.json({ message: 'Carrito eliminado correctamente' });
});

export default cartsRouter;
