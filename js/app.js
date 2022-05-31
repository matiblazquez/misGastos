// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', perguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}
//clases 
class Presupuesto{
    constructor(presupuesto, restante){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = []; 
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        //console.log(this.restante);
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //extraemos valores 
        const { presupuesto, restante }= cantidad; 
        
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    imprimerAlerta(mensaje, tipo){
        //crear el div de alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        // mensaje de error
        divMensaje.textContent = mensaje;
        //insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);
         //Quitarlo del htmal
         setTimeout( ()=>{
             divMensaje.remove();
         },3000);
    }
    mostrarGastos(gastos){
        
        this.limpiarHtml();
       //iterar sobre los gastos 
       gastos.forEach(gasto=> {
           const {cantidad, nombre, id} = gasto;
           // Crear un LI
           const nuevoGasto =document.createElement('li');
           nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
           nuevoGasto.dataset.id = id;


           //Agregar e Html del Gasto
           nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`



           // Boton para borrar el Gasto
           const btnBorrar = document.createElement('button');
           btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
           btnBorrar.innerHTML = 'Borrar &times'
           btnBorrar.onclick = () =>{
               eliminarGasto(id);
           }

           nuevoGasto.appendChild(btnBorrar);
           //agregar al HTML
           gastoListado.appendChild(nuevoGasto);
       })
    }
    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv =document.querySelector('.restante');
        
        //comprobar 25%
        if((presupuesto / 4) > restante){
           restanteDiv.classList.remove('alert-success', 'alert-warning');
           restanteDiv.classList.add('alert-danger');

        }else if((presupuesto/2) > restante){
           restanteDiv.classList.remove('alert-success');
           restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        // si el total es 0 o menor
        if(restante <= 0 ){
            ui.imprimerAlerta('El presupuesto se a terminado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }
}
//instanciar
const ui = new UI();

let presupuesto;

//funciones
function perguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');   
    //console.log(Number (presupuestoUsuario) );
    if (presupuestoUsuario ===  '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    //presupuesto Valido
    presupuesto = new Presupuesto(presupuestoUsuario)
    //console.log(presupuesto);
    
    ui.insertarPresupuesto(presupuesto);
}

//agregar los gastos
function agregarGasto(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    if (nombre === '' || cantidad ===''){
        ui.imprimerAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimerAlerta('cantidad no valida', 'error');
        return;
    }
    // generando un objeto de tipo Gasto
    const gasto = { nombre, cantidad, id: Date.now() }
    //añade nuevo Gasato
    presupuesto.nuevoGasto(gasto);
    // mensaje de todo bien
    ui.imprimerAlerta('El gasto se agrego correctamente');
    //imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    //reinicia el formulario.
    formulario.reset();
}
function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    //eliminar los  gastos del HTML.
    const {gastos, restante}= presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}