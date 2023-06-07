//seleccionar el formulario del archivo .html por su id = "transactionForm"
const form = document.getElementById("transactionForm");

//le colocamos una escucha de eventos, que escuche el evento "submit" del
//boton del formulario, para hacer otras funciones con ello
form.addEventListener("submit", function(event) {

    //aca se deberian agregar validaciones para el evento submit

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
    //primero corremos la funcion para cargar todas las categorias que tengamos creadas
    drawCategory();
    
    //traemos lo guardado en el localStorage previamente convertido desde el formato json
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")) || [];

    //recorremos el arreglo mediante el metodo .forEach(), y a cada elemento lo inssertamos
    //en una nueva fila de la tabla del html
    transactionObjArr.forEach(function (arrayElement) {
        insertRowInTransactionTable(arrayElement);
    });
});

//funcion que obtiene las transacciones guardadas en el backend y las guarda en un 
//array para mostrarlas en el front
function getTrnasactionsFromApi() {
    const allTransactions = [];
    return allTransactions;
};

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
//agregamos boton eliminar al crear nuava fila con un eventListener para eliminar datos
//del local storage
function insertRowInTransactionTable(transactionObjet) {
    //hacemos una referencia a la tabla mediante su id en el html
    let transactionTableRef = document.getElementById("transactionTable");

    //.insertRow(): metodo nativo para insertar una fila en la tabla
    let newTransactionRowRef = transactionTableRef.insertRow(-1);

    //al insertar la nueva fila, le añadimos un id mediante un atributo personalizado
    //para saber cual seleccionar al momento de eliminar cualquier dato
    newTransactionRowRef.setAttribute("data-transaction-id", transactionObjet["transactionId"]);

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
    deletebutton.textContent = "Eliminar";
    newDeleteCell.appendChild(deletebutton);

    //agregamos un eventListener al boton eliminar para que ejecute la funcion de eliminar
    //elimina la fila y los datos del localStorage
    deletebutton.addEventListener("click", (event) =>{
        //al hacer click, primero selecciona la fila de la tabla a eliminar
        let transactionRow = event.target.parentNode.parentNode;
        //luego selecciona el id especificado para esa fila mediante el atributo
        //data-transaction-id
        let transactionId = transactionRow.getAttribute("data-transaction-id");
        //eliminamos la fila seleccionada en transactionRow
        transactionRow.remove();
        //eliminamos los datos correspondientes en el localStorage mediante la funcion
        //deleteTransactionObject()
        deleteTransactionObject(transactionId);
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

//funcion para eliminar objetos del localStorage
function deleteTransactionObject(transactionId){
    //tomamos el array desed el localStorage y lo convertimos de formato json a objeto javascript
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    //filtramos el elemento dentro del array con el id que queremos eliminar
    //aca habia un error en la comparacion ya que tomaba el valor guardado en el localStorage que
    //era un entero y lo comparaba estrictamente con un string
    let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == transactionId);
    //eliminamos el indice del elemento que contenga el id seleccionado en el array original
    transactionObjArr.splice(transactionIndexInArray, 1);
    //el array que se devuelve con el elemento ya eliminado lo convertimos a json nuevamente
    //y lo guardamos en el localStorage
    let transactionArrayJSON = JSON.stringify(transactionObjArr);
    localStorage.setItem("transactionData", transactionArrayJSON);
};

//las dos funciones para agregar categorias solo agregan las categorias que ya estan
//cargadas en el array de la funcion drawCategory, entonces faltaria algo para que el
//usuario ingresara nuavas categorias y estas se guardaran en el array

//funcion para crear las categorias a agregar
function drawCategory() {
    let allCategories = ["Alquiler", "Comida", "Diversion"];
    for(let index = 0; index < allCategories.length; index++) {
        insertCategory(allCategories[index]);
    }
};

//funcion para agregar nuevas categorias al formulario
function insertCategory(categoryName) {
    //seleccionamos el elemento donde insertar la nueva categoria
    const selectElement = document.getElementById("transactionCategory");
    //pasamos en una variable el template string a insertar
    let htmlToInsert = `<option>${categoryName}</option>`;
    //con insertAdjacentHTML pasamos la posicion y el string a insertar
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert)
};