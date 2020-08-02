

const token = 'frmDdsqeCm';

class API {
    
    async obtenerDatos(){
        //obtener datos de api
        const datos = await fetch('https://api.cne.cl/v3/combustibles/vehicular/estaciones?token=frmDdsqeCm');

        const response = await datos.json();

        return{
            response
        }

        console.log(datos);
    }
    
}