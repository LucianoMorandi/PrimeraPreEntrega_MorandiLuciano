import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager('./products.json');
const productsRoutes = Router();

productsRoutes.get('/', async (req, res) =>{
    const {limit} = req.query;
    const productList = await productManager.getProducts();
    if (!limit || limit >= productList.length) {
      return res.send({productList});
    };
  
    const limitedProducts = productList.splice(0, limit);
    return res.send({limitedProducts});
});
  
productsRoutes.get('/:pid', async (req, res) => {
    const {pid} = req.params;
    const productById = await productManager.getProductsById(parseInt(pid));
  
    if (!productById) {
      return res.status(404).send({error: 'producto no encontrado'});
    };
  
    res.send({productById});
});

productsRoutes.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        } = req.body;
        console.log(req.body);
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ error: 'Faltan datos para ingresar producto' });
        }
        const product = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || [],
            status: true
        };
        console.log(product);
        await productManager.addProduct(product);
        res.send({message: 'Producto agregado'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'No se pudo agregar el producto' });

    }
});

productsRoutes.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productToUpdate = req.body;

        if (isNaN(+pid)) {
            return res.status(400).send({ error: 'El ID debe ser un número válido' });
        }
        const productId = +pid;
        await productManager.updateProduct(productId, productToUpdate);
        res.send({ message: 'Producto actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'No se pudo actualizar el producto' });
    }
});

productsRoutes.delete('/:pId', async (req, res) => {
    const {pId} = req.params;
    const productDeleted = await productManager.deleteProduct(pId);
    if (!productDeleted) {
        return res.status(404).send({message: 'producto no encontrado'});
    }
    res.send({message: 'producto eliminado  '})
});

export default productsRoutes;