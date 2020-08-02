class UI{
    constructor(){
        //instancias la api
        this.api = new API();

        //crear los markers con layergrupo
        this.markers = new L.layerGroup(); 

        //iniciar el mapa
        this.mapa = this.inicializarMapa();
    }


    inicializarMapa() {
        // Inicializar y obtener la propiedad del mapa
        const map = L.map('mapa').setView([-35.675148, -71.5429688], 6);
        const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + enlaceMapa + ' Contributors',
            maxZoom: 15,
            }).addTo(map);
        return map;

   }

   mostrarEstablecimientos(){ 
        this.api.obtenerDatos()
        .then(datos => {
            const resultado = datos.response.data;

            //ejecutar fn para mostrar los pines
            this.mostrarPines(resultado);
        })
   }

   mostrarPines(datos){
       //limpiar los markers
       this.markers.clearLayers();
       //console.log(datos); 

       //recorrer las bencineras
       datos.forEach(dato =>{
           const {ubicacion, direccion_calle, direccion_numero, distribuidor, nombre_comuna, nombre_region,metodos_de_pago, horario_atencion, precios, servicios} = dato; 
           const {latitud, longitud} = ubicacion;
           const {nombre,logo, logo_horizontal_svg} = distribuidor;
           const {efectivo, cheque } = metodos_de_pago;

           const {tienda,farmacia, autoservicio, mantencion} = servicios; 

           const tarjetas_bancarias = metodos_de_pago['tarjetas bancarias'];
           const tarjetas_grandes_tiendas = metodos_de_pago['tarjetas grandes tiendas'];

           const gasolina_93 = precios['gasolina 93']; 
           const gasolina_95 = precios['gasolina 95']; 
           const gasolina_97 = precios['gasolina 97']; 
           const petroleo_diesel = precios['petroleo diesel']; 

           //crear popup
           const opcionesPopUp = L.popup()
                .setContent(`
                <img src='${logo_horizontal_svg}' width="100" height="auto"/>
                <p>Direccion: ${direccion_calle} ${direccion_numero} </p>
                <p>Region: ${nombre_region} Comuna: ${nombre_comuna}</p>
                <p>Horario Atencion: ${horario_atencion}</p>
                <p>Precios: ${(precios['gasolina 93'] ? `93: ${gasolina_93} -` : '')} ${(precios['gasolina 95'] ? `95: ${gasolina_95} - ` : '')}${(precios['gasolina 97'] ? `97: ${gasolina_97} - ` : '')}${(precios['petroleo diesel'] ? `petroleo diesel: ${petroleo_diesel}` : '')}</p>
                <p>Metodos de pago: ${(efectivo ? 'Efectivo' : '')} ${(cheque ? ', Cheque' : '')} ${(tarjetas_bancarias ? ', Tarjetas bancarias' : '')} ${(tarjetas_grandes_tiendas ? ', Tarjetas grandes tiendas' : '')}</p>
                <p>Servicios:  ${(tienda ? 'Tienda' : '')} ${(farmacia ? 'Farmacia' : '')}  ${(autoservicio ? 'Autoservicio' : '')} ${(mantencion ? 'Mantencion' : '')} </p>

                `);

           //agregar el pin
           const marker = new L.marker([
               parseFloat(latitud), 
               parseFloat(longitud)
           ]).bindPopup(opcionesPopUp);

           this.markers.addLayer(marker);

           //console.log(latitud,longitud);
       });

       this.markers.addTo(this.mapa);
   }


   //buscador

   obtenerSugerencias(busqueda){
       this.api.obtenerDatos()
            .then(datos => {
                const resultado = datos.response.data; 

                this.filtrarSugerencias(resultado, busqueda);
            })
   }


   filtrarSugerencias(resultado, busqueda){
       //filtrar con filter

       const busqueda_capitalizada = busqueda.replace(/\b\w/g, l => l.toUpperCase()); 
       const filtro = resultado.filter(filtro => filtro.nombre_comuna.indexOf(busqueda_capitalizada) !== -1); 
       console.log(filtro);

       //mostrar los pines
       this.mostrarPines(filtro); 
   }

}