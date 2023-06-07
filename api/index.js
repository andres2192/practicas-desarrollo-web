//varibles para importar los paquetes necesarios para que funcione el programa

//importamos express(node)
const express = require('express');

//llamamos la funcion express() que ejecuta todo express
const app = express();

//definimos el puesrto donde va a recibir las peticiones el servidor
const port = 3000;

//array con las transacciones guardadas desde el frontend
const transactions = [
    {
      "transactionType": "egreso",
      "transactionDescription": "comprar papa",
      "transactionAmount": "800",
      "transactionCategory": "Comida",
      "transactionId": 3
    },
    {
      "transactionType": "ingreso",
      "transactionDescription": "alquiler",
      "transactionAmount": "1250",
      "transactionCategory": "Alquiler",
      "transactionId": 4
    },
    {
      "transactionType": "egreso",
      "transactionDescription": "mouse pc",
      "transactionAmount": "400",
      "transactionCategory": "Diversion",
      "transactionId": 5
    }
];

//funcion prueba para mostrar el array de transacciones
app.get('/transactions', (req, res) => {
    res.send(transactions);
});

//funcion prueba para mostrar el array de transacciones con el 
//parametro (id en este caso) que querramos
app.get('/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
    const selectedTransaction = transactions.filter(transaction => transaction.transactionId == transactionId);
    res.send(selectedTransaction);
});

//funcion para recibir los datos desde el frontend (sin terminar)
app.post('/transactions', (req, res) => {
    const transaction = "aca va la transaccion que vino";
    transactions.push(transaction);
    res.send("todo salio ok");
});

//funcion para prueba de coneccion del servidor en puerto 3000
app.listen(port, () => {
  console.log(`corriendo en puerto ${port}`);
})