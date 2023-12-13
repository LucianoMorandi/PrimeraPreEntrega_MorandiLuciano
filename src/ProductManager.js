import fs from 'fs';

class ProductManager {
    constructor(path){
        this.path = path;
    }

    static id = 0;

    async addProduct(product){
        if (!product.title || !product.description || !product.code || !product.stock || !product.thumbnail || !product.price) {
            return console.error('Datos incompletos');
        }
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        const products = await this.getProducts();
        const newProduct = {
            id: maxId + 1,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            status: true
        }
        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
    }

    async getProducts(){
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    
    async getProductsById(id){
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            return console.error('Producto no encontrado');
        }
        return product;
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        const productId = products.some(p => p.id === +id);

        if (productId) {
            const newProductsList = products.filter(p => p.id !== +id);
            await fs.promises.writeFile(this.path, JSON.stringify(newProductsList), 'utf-8');
            return true;
        } else {
            console.log(`El ID no existe`);
            return false;
        }
    }

    async updateProduct(id, productToUpdate) {
        const products = await this.getProducts();
        const updatedProducts = products.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    ...productToUpdate,
                    id: p.id
                };
            }
            return p;
        });
    
        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8');
    }
}

export default ProductManager;