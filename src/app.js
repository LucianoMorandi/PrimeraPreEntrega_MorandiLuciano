import express from 'express';
import ProductManager from './ProductManager.js';

const PORT = 8080;
const productManager = new ProductManager('./products.json');
const app = express();
app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) =>{
  const {limit} = req.query;
  const productList = await productManager.getProducts();
  if (!limit || limit >= productList.length) {
    return res.send({productList});
  };

  const limitedProducts = productList.splice(0, limit);
  return res.send({limitedProducts});
});

app.get('/products/:pid', async (req, res) => {
  const {pid} = req.params;
  const productById = await productManager.getProductsById(parseInt(pid));

  if (!productById) {
    return res.send({error: 'producto no encontrado'});
  };

  res.send({productById});
});

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });