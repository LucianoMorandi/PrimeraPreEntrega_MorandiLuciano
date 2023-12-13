import { Router } from "express";
import CartManager from "../CartManager.js";

const cartsRoutes = Router();
const cartManager = new CartManager('src/carts.json');

cartsRoutes.get('/', async (req, res) => {
    const carts = await cartManager.getCarts();
    res.send(carts);
});

cartsRoutes.get('/:cId', async (req, res) =>{
    const {cId} = req.params;
    const cartById = await cartManager.getCartById(parseInt(cId));

    if (!cartById) {
        return res.status(404).send({error: 'Carrito no encontrado'});
    };
    res.send(cartById);
})

cartsRoutes.post('/', async (req, res) => {
    const cartAdded = await cartManager.addCart();
    if (!cartAdded) {
        return res.status(400).send({error: 'carrito no agregado'});
    };
    res.send({message: 'carrito agregado'});
});

cartsRoutes.post('/:cId/product/:pId', async (req, res) => {
    const {cId, pId} = req.params;
    const productAddedToCart = await cartManager.addProductToCart(pId, cId);
    if (!productAddedToCart) {
        return res.status(400).send({error: 'Producto no agregado al carro'});
    }
    res.send({message: 'Producto agregado al carrito'});
});

export default cartsRoutes