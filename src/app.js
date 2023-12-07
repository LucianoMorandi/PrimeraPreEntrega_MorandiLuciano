import express from 'express';
import ProductManager from './ProductManager.js';

const PORT = 8080;
const productManager = new ProductManager('./products.json');
const app = express();
app.use(express.urlencoded({extended: true}));

app.get('/products', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

    const products = productManager.getProducts(limit);

    if (limit) {
      res.send(`Mostrando ${limit} productos: ${JSON.stringify(products)}`);
    } else {
      res.send(`Mostrando todos los productos: ${JSON.stringify(products)}`);
    }
  } catch (error) {
    console.error(error);
    res.send('Error al procesar la solicitud');
  }
});

app.get('/products/:pid', (req, res) => {
    try {
      const productId = parseInt(req.params.pid, 10);
      const product = productManager.getProductById(productId);
      if (product) {
        res.json({ product });
      } else {
        res.send({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.send({ error: 'Error al procesar la solicitud' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });