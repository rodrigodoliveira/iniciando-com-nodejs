const { request, response, json } = require('express');
const express = require('express');
const { randomUUID } = require('crypto')
const fs = require('fs');

const app = express();
const port = 3000;
let products = [];

readProductsFile();

app.use(express.json());

app.get('/', (request, response) => {
    response.send('Acessou a primeira rota');
});

app.post('/products', (request, response) => {
    //name and price
    const { name, price } = request.body;
    const product = {
        id: randomUUID().toUpperCase(),
        name,
        price
    }

    products.push(product);

    createProductFile();

    response.send({
        data: product,
        success: true,
        message: `Product registred successfully`
    })
});

app.get('/products', (request, response) => {
    response.json(products);
});

app.get('/products/:id', (request, response) => {
    const { id } = request.params;
    const product = products.find(product => product.id === id);
    response.json(product);

});

app.put('/products/:id', (request, response) => {
    const { id } = request.params;
    const { name, price } = request.body;
    const productIndex = products.findIndex(product => product.id === id);

    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }

    createProductFile();

    response.json({
        data: products[productIndex],
        success: true,
        message: 'product updated successfully'
    });

});

app.delete('/products/:id', (request, response) => {
    const { id } = request.params;
    const productIndex = products.findIndex(product => product.id === id);
    products.splice(productIndex, 1);

    createProductFile();

    response.json({
        data: null,
        success: true,
        message: 'Product deleted successfully'
    })
});

function createProductFile(){
    fs.writeFile('products.json', JSON.stringify(products), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('file products.json updated successfully');
        }
    });
}

function readProductsFile(){
    fs.readFile('products.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        }else{
            products = JSON.parse(data);
        }
    });
}



app.listen(port, () => console.log(`servidor está rodando na porta: ${port}`))