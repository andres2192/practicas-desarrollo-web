//seleccionar el formulario del archivo .html por su id = "transactionForm"
const form = document.getElementById("transactionForm");

//le colocamos una escucha de eventos, que escuche el evento "submit" del
//boton del formulario, para hacer otras funciones con ello
form.addEventListener("submit", function(event) {
    // 1- prevenimos (por el momento) el funcionamiento por defecto del evento 
    //submit que envia los datos al servidor y recarga automaticamente la pagina
    event.preventDefault();

    //aca guardamos en una nueva variable el resultado de la funcion FormData
    //la cual permite gurdar toda la info que pasemos en el formulario
    let transactionFormData = new FormData(form);

    //aca aplicamos una funcion creada mas abajo para obtener los datos del formulario
    //creados con el FormData en forma de objeto asociativo
    let transactionObjet = convertFormDataToTransactionObject(transactionFormData);
    
    //funcion creada para transformar los datos obtenidos a formato json y guardarlos
    // en la memoria local del navegador
    saveTransactionObjet(transactionObjet);
    
    //funcion creada para insertar los datos enviados en nuevas filas de la tabla
    //en el html
    insertRowInTransactionTable(transactionObjet);
    
    //funcion nativa para resetear un formulario, en este caso con el evento "submit"
    form.reset();
});

//escucha de eventos para rellenar automaticamente la tabla del html con los datos
//guardados en el localStorage al terminar de cargarse el DOM (primero se termina de
//cargar el DOM luego sigue con el CSS, los scripts y demas cosas)
document.addEventListener("DOMContentLoaded", function(event) {
    //traemos lo guardado en el localStorage previamente convertido desde el formato json
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")) || [];

    //recorremos el arreglo mediante el metodo .forEach(), y a cada elemento lo inssertamos
    //en una nueva fila de la tabla del html
    transactionObjArr.forEach(function (arrayElement) {
        insertRowInTransactionTable(arrayElement);
    });
});

//funcion para generar un id para los datos guardados en el local storage, para que
//se puedan eliminar
function newGetTransactionId() {
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;
};

//esta funcion permite obtener los valores de los campos del formulario tomados con
//la funcion nativa FormData
function convertFormDataToTransactionObject(transactionFormData) {
    //aca en cada .get() pasamos el nombre de referencia de cada campo que tengamos 
    //en el formulario (name = "transactionType")
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("transactionDescription");
    let transactionAmount = transactionFormData.get("transactionAmount");
    let transactionCategory = transactionFormData.get("transactionCategory");
    //agregamos un elemento al array  como id para identificar
    let transactionId = newGetTransactionId();

    //retornamos un objeto asociativo
    return {
        "transactionType": transactionType,
        "transactionDescription": transactionDescription,
        "transactionAmount": transactionAmount,
        "transactionCategory": transactionCategory,
        "transactionId": transactionId
    }
};

//funcion para insertar nuevas filas en la tabla del archivo html
function insertRowInTransactionTable(transactionObjet) {
    //hacemos una referencia a la tabla mediante su id en el html
    let transactionTableRef = document.getElementById("transactionTable");

    //.insertRow(): metodo nativo para insertar una fila en la tabla
    let newTransactionRowRef = transactionTableRef.insertRow(-1);

    //aca pasamos los valores que tendran cada celda de la nuava fila agregada
    //mediante el metodo .incertCell() para seleccionar la celda afectada, y la
    //funcion nativa .textContent para pasarle el contenido
    let newTypeCellRef = newTransactionRowRef.insertCell(0);
    let newText  = document.createTextNode(transactionObjet["transactionType"]);
    newTypeCellRef.appendChild(newText);

    newTypeCellRef = newTransactionRowRef.insertCell(1);
    newText  = document.createTextNode(transactionObjet["transactionDescription"]);
    newTypeCellRef.appendChild(newText);

    newTypeCellRef = newTransactionRowRef.insertCell(2);
    newText  = document.createTextNode(transactionObjet["transactionAmount"]);
    newTypeCellRef.appendChild(newText);

    newTypeCellRef = newTransactionRowRef.insertCell(3);
    newText  = document.createTextNode(transactionObjet["transactionCategory"]);
    newTypeCellRef.appendChild(newText);

    //agregamos un boton para eliminar la fila correspondiente
    let newDeleteCell = newTransactionRowRef.insertCell(4);
    let deletebutton = document.createElement("button");
    deletebutton.textContent = "eliminar";
    newDeleteCell.appendChild(deletebutton);

    //agregamos un ventListener al boton eliminar para que ejecute la funcion de eliminar
    deletebutton.addEventListener("click", (event) =>{
        event.target.parentNode.parentNode.remove();
    });
};

//funcion para transformar los datos obtenidos desde el formulario html a formato JSON
//y luego guardarlos en la memoria local del navegador
function saveTransactionObjet(transactionObjet) {
    //tomamos el json ya guardado en el localStorage para poder ir guardando todos los
    //objetos que formemos al enviar el formulario en un arreglo de objetos
    //debemos desconvertirlo del formato json para poder trabajar con el array
    //por defecto si no hay un json preexistente guardado, agarra un array vacio
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];

    //agregamos el nuevo objeto del formulario en el arreglo existente
    myTransactionArray.push(transactionObjet);

    //JSON.stringify(): funcion nativa para transformar al formato JSON
    let transactionArrayJSON = JSON.stringify(myTransactionArray);

    //funcion nativa para guardar el json en la memoria local. la funcion tiene dos
    //parametros: el nombre que sera la clave para referencia, y el valor a guardar
    localStorage.setItem("transactionData", transactionArrayJSON);
};