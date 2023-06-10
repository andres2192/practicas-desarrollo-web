//varibles para importar los paquetes necesarios para que funcione el programa

//importamos express(node)
const express = require('express');
//importamos cors para poder "esquivar" la politica de comunicacion desde mismo
//origen entre cliente/servidor
const cors = require('cors');
//importar un paquete para manejar los datos json traidos desde el frontend
//con esto se soluciona el "req.body = undefined" con la peticion post
//const bodyParser = require("body-parser");

//llamamos la funcion express() que ejecuta todo express
const app = express();

//lamamos la funcion cors() para que se apliquen los requerimientos correspondientes
app.use(cors());

//aca usa "app.use(express.json())", que yo no lo tenia escrito en el codigo antes de
//buscar y terminar instalando el npm bodyParser para el error del req.body undefined
//y si funciona
//app.use(bodyParser.json());
app.use(express.json());

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
    },
    {
      "transactionType": "ingreso",
      "transactionDescription": "mercado pago",
      "transactionAmount": "1500",
      "transactionCategory": "app",
      "transactionId": 6
    }
];

//funcion para mostrar el array de transacciones
app.get('/transactions', (req, res) => {
    res.send(transactions);
});

//funcion para mostrar el array de transacciones con el 
//parametro (id en este caso) que querramos
app.get('/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
    const selectedTransaction = transactions.filter(transaction => transaction.transactionId == transactionId);
    res.send(selectedTransaction);
});

//funcion para recibir los datos desde el frontend
app.post("/transactions", (req, res) => {
  //se reciben los datos y se muestran en pantalla
  let data = req.body;
  //se guardan los datos traidos en una variable
  const transaction = data;
  //pusheamos los datos en el array "transactions"
  transactions.push(transaction);
  res.send("todo recibido");
});

//funcion para coneccion del servidor en puerto 3000
app.listen(port, () => {
  console.log(`corriendo en puerto ${port}`);
});