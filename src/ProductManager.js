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
        let newId = ProductManager.id++
        const products = await this.getProducts();
        const newProduct = {
            id: newId + 1,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock
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
        const productDeleted = products.filter(p => p.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(productDeleted), 'utf-8');  
    }

    async updateProduct(id, productToUpdate){
        const products = await this.getProducts();
        const updatedProducts = products.map(p => {
            if (p.id === id) {
                return{
                    ...p,
                    ...productToUpdate,
                    id
                }
            }
            return p;
        });

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8');
    }
}

// const test = async () => {
//     const productManager = new ProductManager('./products.json');
//     await productManager.addProduct({
//         title: 'Pedigree Adulto',
//         description: 'Alimento completo para perros',
//         code: 4000,
//         price: 21000,
//         thumbnail: './pedigree.jpg',
//         stock: 100
        
//     });
//     await productManager.addProduct({
//         title: 'Pedigree Cachorros',
//         description: 'Alimento completo para perros',
//         code: 4010,
//         price: 21000,
//         thumbnail: './pedigree.jpg',
//         stock: 100
        
//     });
//     await productManager.addProduct({
//         title: 'Pedigree Pequeños',
//         description: 'Alimento completo para perros',
//         code: 4039,
//         price: 21000,
//         thumbnail: './pedigree.jpg',
//         stock: 100
        
//     });
//     await productManager.addProduct({
//         title: 'Whiskas pescado',
//         description: 'Alimento completo para gatos',
//         code: 4024,
//         price: 19000,
//         thumbnail: './whiskas.jpg',
//         stock: 100
        
//     });
//     await productManager.addProduct({
//         title: 'Whiskas pollo',
//         description: 'Alimento completo para gatos',
//         code: 4018,
//         price: 19000,
//         thumbnail: './whiskas.jpg',
//         stock: 100
        
//     });
//     await productManager.addProduct({
//         title: 'Whiskas carne',
//         description: 'Alimento completo para gatos',
//         code: 4021,
//         price: 19000,
//         thumbnail: './whiskas.jpg',
//         stock: 100
        
//     });

//     // const productById = await productManager.getProductsById(2);
//     // console.log(productById);

//     // await productManager.updateProduct(2, {
//     //     title: 'Whiskas carne'
//     // });

//     // await productManager.deleteProduct(1);
// };

// test();

export default ProductManager;