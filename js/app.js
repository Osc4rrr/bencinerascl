const ui = new UI(); 

document.addEventListener('DOMContentLoaded', () =>{
    ui.mostrarEstablecimientos();

})

//habilitar busqueda de estavblecimientos

const buscador = document.querySelector('#buscar input'); 

buscador.addEventListener('input', () =>{
    if(buscador.value.length > 3){
        //buscar en la api

        ui.obtenerSugerencias(buscador.value);
    }
})