/* VARIABLES GENERALES */
const miForm = document.getElementById('miForm');
const error = document.getElementById('error');

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
    let select = document.getElementById("tipoConsumo"); //Seleccionamos el select
    
    for(let i=0; i < optionConsumos.length; i++){ 
        let option = document.createElement("option"); //Creamos la opcion
        option.innerHTML = listaConsumo[i]; //Metemos el texto en la opción
        select.appendChild(option); //Metemos la opción en el select
    }
}
cargar();

// FUNCION QUE CALCULA EL COSTO DEL VIAJE
function calcularConsumo(){
    // KILOMETROS
    const UIkm = document.getElementById('kilometros');
    const km = parseFloat(UIkm.value);

    // PRECIO COMBUSTIBLE
    const precioCombustible = document.getElementById('precioCombustible').value;

    // CONSUMOS
    const tipoConsumo = document.getElementById('tipoConsumo').value;
    const consumo = arrayConsumo.find((el)=> el.tipo === tipoConsumo);

    console.log(consumo.consumo);
    console.log(km);
    console.log(precioCombustible); 

    cantidadLitros = (km / 100 * consumo.consumo).toFixed(2); 
    costoViajeIda = cantidadLitros * precioCombustible;
    document.getElementById('resultado').innerHTML = (new Intl.NumberFormat('es-ES' , { style: 'currency', currency: 'ARS' })).format(costoViajeIda);
}

/* FUNCIÓN CALCULAR */
function calcular(){

/* VALIDA LOS CAMPOS VACIOS */ 
    
/*     if(miForm.tipoConsumo.value==0){
        error.style.display='flex';
        document.getElementById('error').innerHTML = "Seleccione un tipo automovil";
        miForm.tipoConsumo.focus();
        return false;
    } else{
        error.style.display='none';
    } */

    if(miForm.kilometros.value==0){
        error.style.display='flex';
        document.getElementById('error').innerHTML = "Ingrese los kilometros a recorrer";
        miForm.kilometros.focus();
        return false;
    } else{
        error.style.display='none';
    }

    if(miForm.precioCombustible.value==0){
        error.style.display='flex';
        document.getElementById('error').innerHTML = "Ingrese precio de Combustible";
        miForm.precioCombustible.focus();
        return false;
    } else{
        error.style.display='none';
    }

    calcularConsumo()
   /* Muestra RESULTADOS  & DA VUELTA LA CARD */
    let elemFirst = document.querySelector(".card__inner"); 
    elemFirst.classList.toggle('is-flipped');

    }

/* RESETEA CALCULADORA & DA VUELTA LA CARD */
function changeCss() {
    let elemFirst = document.querySelector(".card__inner");
    document.getElementById("miForm").reset();
    elemFirst.classList.toggle('is-flipped');
    }

