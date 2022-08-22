// SELECCION DE DIV SPINNER
const loader = document.querySelector("#loading");

// SELECCION DE DIV CARD
const cardBody = document.querySelector(".simulador-background");

// FUNCION MUESTRA SPINNER
function displayLoading() {
    loader.style.display="block"
    cardBody.style.display="none"
    // FRENA SPINNER DESPUES DE UN TIEMPO DETERMINADO
    setTimeout(() => {
        loader.style.display="none"
        cardBody.style.display="block"
    }, 3000);
}

// FUNCION QUE TRAE EL JSON DE DATOS
function obtenerJSON(url) {
    return new Promise((resolve, reject) => {
    fetch(url)
        .then((response) => {
        if (response.ok) {
            displayLoading() 
            return response.json();
        }
        reject(
            "No hemos podido recuperar ese json. El código de respuesta del servidor es: " + response.status
        );
        })
        .then((json) => resolve(json))
        .catch((err) => reject(err));
    });
    }

// FUNCION PARA CARGAR UN ARRAY DENTRO DE UN "SELECT"
function cargar() {

    obtenerJSON('../../db_consumo.json')
    .then((json) => {
    arrayConsumo = json
    console.log("el json de respuesta es:", json);

    let optionConsumos = []
    // EJECUCION DE CODIGO PARA PUSHEAR ELEMENTOS DEL ARRAY CONSUMO DENTRO DEL SELECT DEL FORM
    for (let i = 0; i < arrayConsumo.length; i++) { 
        // Se recorre el array con el bucle for y así accedo a los object que tiene
        for (let key in arrayConsumo[i]) { 
        // Pongo una variable en el for, que accederá a las key (propiedades) de los objetos con 'in' más el objeto al que se quiere acceder 
            if (arrayConsumo[i].hasOwnProperty(key) && key === "tipo") {
            // verificar si el objeto contiene esa propiedad con 'hasOwnProperty(valor)' y si la key es igual a tipo
                optionConsumos.push(arrayConsumo[i][key]); // agregamos el id al (array)
                }
            }
        }

    let listaConsumo = optionConsumos; //array de consumos filtrados
    let select = document.querySelector('#tipoConsumo'); //Seleccionamos el select
    
    for(let i=0; i < optionConsumos.length; i++){ 
        let option = document.createElement('option'); //Creamos la opcion
        option.innerHTML = listaConsumo[i]; //Metemos el texto en la opción
        select.appendChild(option); //Metemos la opción en el select
    }
    
    })
    .catch((err) => {
    console.log("Error encontrado:", err);
    });
}

cargar() // SE CARGA LOS SELECT CON LAS OPCIONES DE CONSUMOS

// ALERT CON INPUT - EL USUARIO DEBE INGRESAR NOMBRE 
if (localStorage.getItem('nombre') === null) {
    Swal
    .fire({
        title: "Tu nombre",
        input: "text",
        showCancelButton: false,
        confirmButtonText: "Guardar",
        allowOutsideClick: false, // PREVIENE Y BLOQUEA EL CLICK FUERA DEL ALERT
        inputValidator: nombre => {
            // Si el valor es válido, debes regresar undefined. Si no, una cadena
            if (!nombre) {
                return "Por favor escribe tu nombre";
            } else {
                return undefined;    
            }
        }
    })
    .then(resultado => {
        if (resultado.value) {
            let nombre = resultado.value;
            localStorage.setItem('nombre', JSON.stringify(nombre));
            console.log("Hola, " + nombre);
        } else {
            return false;
        }
    });
    } else {
        // SE LEVANTA EL NOMBRE DESDE EL LOCALSTORAGE
        document.querySelector('#nombre').innerHTML = JSON.parse(localStorage.getItem('nombre')); 
    }

/* VARIABLES GENERALES */
const miForm = document.querySelector('#miForm');
const error = document.querySelector('#error');

/* BTN CALCULAR */
const btnCalcular = document.querySelector('#btnCalcular'); 
btnCalcular.addEventListener('click', () => {  
    calcular()
});

/* BTN RESET */
const btnReset = document.querySelector('#btnReset');
btnReset.addEventListener('click',() => {
    changeCss();
});


/* RESETEA CALCULADORA & DA VUELTA LA CARD */
function changeCss() {
    const elemFirst = document.querySelector('.card__inner');
    document.querySelector('#miForm').reset();
    elemFirst.classList.toggle('is-flipped');
}

////////////////////////////////////////////////////////////////////////////////////////

//SETTINGS MAPS LAT - LONG & OPTIONS
const myLatLng = { 
    lat: 38.3460, 
    lng: -0.4907 };
const mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

//SE CREA EL MAPA
const map = new google.maps.Map(document.querySelector('#googleMap'), mapOptions);

//SE CREA directionsService PARA USAR EL METODO ROUTE  Y SE OBTIENE EL RESULTADO PARA EL REQUEST
const directionsService = new google.maps.DirectionsService();

//SE CREA DirectionsRenderer PARA MOSTRAR EL RESULTADO DEL REQUEST
const directionsDisplay = new google.maps.DirectionsRenderer();

//SE ENZLAZA EL RESULTADO AL MAPA
directionsDisplay.setMap(map);

//SE DEFINE LA FUNCION CALCULAR RUTA
function calcRoute() {
    //SE CREA LA SOLICITUD
    const request = {
        origin: document.querySelector('#from').value,
        destination: document.querySelector('#to').value,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    }

    //PASAR SOLICITUD AL METODO DE ROUTE
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //IMPRIME ORIGEN Y DESTINO
            document.querySelector('#desde').innerHTML = document.querySelector('#from').value;
            document.querySelector('#hasta').innerHTML = document.querySelector('#to').value;

            //SE MUESTRA RUTA
            directionsDisplay.setDirections(result);

            /* Muestra RESULTADOS  & DA VUELTA LA CARD */
            const elemFirst = document.querySelector('.card__inner'); 
            elemFirst.classList.toggle('is-flipped');
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se encontró una ruta terrestre',
                footer: '<a href="https://www.despegar.com.ar/">¿Querés volar a tu destino?</a>'
            })
        }
    //SE RECUPERA EL NOMBRE DESDE EL LOCALSTORAGE Y LO MUESTRA EN RESULTADOS
    document.querySelector('#nombre').innerHTML = JSON.parse(localStorage.getItem('nombre'));

    // TIEMPO DE VIAJE
    const tiempoViaje = result.routes[0].legs[0].duration.value / 60; // TRANFORMA DE SEGUNDOS A MINUTOS

    // KILOMETROS
    const km = result.routes[0].legs[0].distance.value / 1000;

    // PRECIO COMBUSTIBLE
    const precioCombustible = document.querySelector('#precioCombustible').value;

    // CONSUMOS
    obtenerJSON('../../db_consumo.json')
    .then((json) => {
    arrayConsumo = json
    
    const tipoConsumo = document.querySelector('#tipoConsumo').value;
    /* const consumosArray = arrayConsumo */
    const consumo = arrayConsumo.find((el)=> el.tipo === tipoConsumo);
    
    // IDA O VUELTA
    const ida = document.querySelector('#ida');
    const idaVuelta = document.querySelector('#idaVuelta'); // NO SE ESTA USANDO
    
    cantidadLitros = (km / 100 * consumo.consumo).toFixed(2); 
    costoViajeIda = cantidadLitros * precioCombustible;
    costoIdaVuelta = costoViajeIda * 2;
    
    // COMPRUEBA SI EL USUARIO QUIERE CALCULAR IDA O VUELTA Y LO MUESTRA
    if (ida.checked === true){
        document.querySelector('#resultado').innerHTML = (new Intl.NumberFormat('es-ES' , { style: 'currency', currency: 'ARS' })).format(costoViajeIda);
        document.querySelector('#distancia').innerHTML = km.toFixed(1) + " KM";
        document.querySelector('#idaVueltaText').innerHTML = "- SOLO DE IDA -"

        // VALIDA TIEMPO Y MUESTRA HORAS O MINUTOS
        if (tiempoViaje > 60){
            const tiempoHora = tiempoViaje / 60
            document.querySelector('#duracion').innerHTML = tiempoHora.toFixed(2)  + " Horas";
        } else{
            document.querySelector('#duracion').innerHTML = tiempoViaje.toFixed(2)  + " Minutos";
        }
        
    } else{
        document.querySelector('#resultado').innerHTML = (new Intl.NumberFormat('es-ES' , { style: 'currency', currency: 'ARS' })).format(costoIdaVuelta);
        document.querySelector('#distancia').innerHTML = (km * 2).toFixed(1) + " KM";
        document.querySelector('#idaVueltaText').innerHTML = "- IDA Y VUELTA -"

        const tiempoViajeX2 = tiempoViaje * 2; // MULTIPLICA DURACION DEL VIAJE IDA Y VUELTA

        // VALIDA TIEMPO Y MUESTRA HORAS O MINUTOS
        if (tiempoViajeX2 > 60){
            const tiempoHora = tiempoViajeX2 / 60
            document.querySelector('#duracion').innerHTML = tiempoHora.toFixed(2) + " Horas";
        } else{
            document.querySelector('#duracion').innerHTML = tiempoViajeX2.toFixed(2) + " Minutos";
        }
    }
    });
    })
    .catch((err) => {
    console.log("Error encontrado:", err);
    });
}

//OBJETO DE AUTOCOMPLETE PARA TODOS LOS INPUT
const options = {
    types: ['(cities)']
}

const input1 = document.querySelector('#from');
const autocomplete1 = new google.maps.places.Autocomplete(input1, options);

const input2 = document.querySelector('#to');
const autocomplete2 = new google.maps.places.Autocomplete(input2, options);

/* FUNCIÓN CALCULAR */
function calcular(){

    // VALIDA LOS CAMPOS VACIOS 
    
    if(document.querySelector('#from').value==""){
        error.style.display='flex';
        document.querySelector('#error').innerHTML = "Seleccione un punto de Origen";
        document.querySelector('#from').focus();
        return false;
    } else{
        error.style.display='none';
    }

    if(document.querySelector('#to').value==""){
        error.style.display='flex';
        document.querySelector('#error').innerHTML = "Seleccione un Destino";
        document.querySelector('#to').focus();
        return false;
    } else{
        error.style.display='none';
    }

    if(miForm.precioCombustible.value==0){
        error.style.display='flex';
        document.querySelector('#error').innerHTML = "Ingrese precio de Combustible";
        miForm.precioCombustible.focus();
        return false;
    } else{
        error.style.display='none';
    }

    calcRoute() // SE EJECUTA LA FUNCION
}

/* FALTA: 

- PONER PRECIOS DE COMBUSTIBLES AUTOMATICOS CON POSIBILIDAD DE QUE EL USUARIO LO CAMBIE
- COLOCAR BOTONES CON ICONOS PARA LAS CLASES DE CONSUMO / AUTOMOVIL

*/


