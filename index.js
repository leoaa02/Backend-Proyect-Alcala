import express from "express";
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';


const app=express();

const PORT= 8080;

app.get("/",(req,res)=>{
    res.send(`<h1>EJECUTANDO SERVIDOR...</h1>`)
}) 

app.use(express.json());

app.use('/api/products', productsRouter); 
app.use('/api/carts', cartsRouter);   

app.listen(PORT, ()=>{
    console.log(`Servidor ejecutandose, correctamente, http://localhost:${PORT}`)
})