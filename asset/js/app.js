// ALERT CON INPUT - EL USUARIO DEBE INGRESAR NOMBRE 
if (localStorage.getItem('nombre') === null) {
    Swal
    .fire({
        title: "Tu nombre",
        input: "text",
        showCancelButton: false,
        confirmButtonText: "Guardar",
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

/* ARRAY DE TIPOS DE CONSUMO X CATEGORIA DE AUTOMOVIL */
const arrayConsumo = [
    {   
        "tipo": "Utilitario",
        "consumo": 7.8,
    },

    {   
        "tipo": "Compacto",
        "consumo": 7,
    },

    {   
        "tipo": "Coupe",
        "consumo": 11,
    },

    {   
        "tipo": "Sedan",
        "consumo": 7.5,
    },

    {   
        "tipo": "SUV",
        "consumo": 9.5,
    },

    {   
        "tipo": "Familiar",
        "consumo": 7.5,
    },

    {   
        "tipo": "Pickup",
        "consumo": 10,
    },

    {   
        "tipo": "Monovolumen",
        "consumo": 7.9,
    },

    {   
        "tipo": "Furgon",
        "consumo": 9,
    },
]

// EJECUCION DE CODIGO PARA PUSHEAR ELEMENTOS DEL ARRAY CONSUMO DENTRO DEL SELECT DEL FORM

let optionConsumos = [];

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

// FUNCION PARA CARGAR UN ARRAY DENTRO DE UN "SELECT"
function cargar() {
    let listaConsumo = optionConsumos; //array de consumos filtrados
    let select = document.querySelector('#tipoConsumo'); //Seleccionamos el select
    
    for(let i=0; i < optionConsumos.length; i++){ 
        let option = document.createElement('option'); //Creamos la opcion
        option.innerHTML = listaConsumo[i]; //Metemos el texto en la opción
        select.appendChild(option); //Metemos la opción en el select
    }
}

cargar(); // EJECUCION DE LA FUNCION AL CARGAR LA PAGINA


////////////////////////////////////////////////////////////////////////////////////////

//set map options
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

            //OBTENER DISTANCIA Y TIEMPO
            document.querySelector('#desde').innerHTML = document.querySelector('#from').value;
            document.querySelector('#hasta').innerHTML = document.querySelector('#to').value;
            document.querySelector('#distancia').innerHTML = result.routes[0].legs[0].distance.text;
            document.querySelector('#duracion').innerHTML = result.routes[0].legs[0].duration.text;

            //SE MUESTRA RUTA
            directionsDisplay.setDirections(result);
            
        } else {
            //SE BORRA LA RUTA DEL MAPA
            directionsDisplay.setDirections({ routes: [] });
            //SE CENTRA EL MAPA EN LA VARIABLE SETEADA
            map.setCenter(myLatLng);
        }

/*     localStorage.setItem('from', JSON.stringify(document.getElementById("from").value));
    localStorage.setItem('to', JSON.stringify(document.getElementById("to").value)); */

    // KILOMETROS
    const km = result.routes[0].legs[0].distance.value / 1000;

    // PRECIO COMBUSTIBLE
    const precioCombustible = document.querySelector('#precioCombustible').value;

    // CONSUMOS
    const tipoConsumo = document.querySelector('#tipoConsumo').value;
    const consumo = arrayConsumo.find((el)=> el.tipo === tipoConsumo);

    // IDA O VUELTA
    const ida = document.querySelector('#ida');
    const idaVuelta = document.querySelector('#idaVuelta'); // NO SE ESTA USANDO

    cantidadLitros = (km / 100 * consumo.consumo).toFixed(2); 
    costoViajeIda = cantidadLitros * precioCombustible;
    costoIdaVuelta = costoViajeIda * 2;

/*     localStorage.setItem('costoIda', JSON.stringify((new Intl.NumberFormat('es-ES' , { style: 'currency', currency: 'ARS' })).format(costoViajeIda)));
    localStorage.setItem('costoIdaVuelta', JSON.stringify((new Intl.NumberFormat('es-ES' , { style: 'currency', currency: 'ARS' })).format(costoIdaVuelta)));
    localStorage.setItem('idaVueltaChecked', JSON.stringify(ida.checked)); */

    // COMPRUEBA SI EL USUARIO QUIERE CALCULAR IDA O VUELTA Y LO MUESTRA
    if (ida.checked === true){
        document.querySelector('#resultado').innerHTML = (new Intl.NumberFormat('es-ES' , { style: 'currency', currency: 'ARS' })).format(costoViajeIda);
    } else{
        document.querySelector('#resultado').innerHTML = (new Intl.NumberFormat('es-ES' , { style: 'currency', currency: 'ARS' })).format(costoIdaVuelta);
    }
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

/* VALIDA LOS CAMPOS VACIOS */ 
    
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

//SE RECUPERA EL NOMBRE DESDE EL LOCALSTORAGE Y LO MUESTRA EN RESULTADOS
    document.querySelector('#nombre').innerHTML = JSON.parse(localStorage.getItem('nombre'));

   /* Muestra RESULTADOS  & DA VUELTA LA CARD */
    const elemFirst = document.querySelector('.card__inner'); 
    elemFirst.classList.toggle('is-flipped');
}





