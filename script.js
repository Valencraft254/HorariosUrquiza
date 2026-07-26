// ================================
// Horarios Ferrocarril Urquiza
// script.js
// ================================

let horarios = {};

const contenedor = document.getElementById("trenes");
const estacionSelect = document.getElementById("estacion");
const sentidoSelect = document.getElementById("sentido");
const horaActual = document.getElementById("hora");

// Cargar horarios.json
async function cargarHorarios() {
    try {
        const res = await fetch("horarios.json");
        horarios = await res.json();

        actualizarTodo();

        setInterval(actualizarTodo, 1000);

    } catch (e) {
        contenedor.innerHTML = `
        <div class="card">
            <div class="estado" style="background:#ff5252;color:white;">
                Error cargando horarios.json
            </div>
        </div>`;
        console.error(e);
    }
}

// Saber qué horario usar
function tipoDia() {

    const dia = new Date().getDay();

    if (dia === 6) return "sabado";
    if (dia === 0) return "feriado";

    return "habil";

}

// Hora actual
function actualizarHora() {

    const ahora = new Date();

    horaActual.textContent = ahora.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return ahora;

}

// Obtener horarios de la estación
function obtenerLista() {

    const dia = tipoDia();

    if (
        !horarios[dia] ||
        !horarios[dia][sentidoSelect.value] ||
        !horarios[dia][sentidoSelect.value][estacionSelect.value]
    ) {
        return [];
    }

    return horarios[dia][sentidoSelect.value][estacionSelect.value];

}

// Actualizar tarjetas
function actualizarTodo() {

    const ahora = actualizarHora();

    const lista = obtenerLista();

    let proximos = [];

    lista.forEach(hora => {

        const [hh, mm] = hora.split(":");

        const fecha = new Date();

        fecha.setHours(Number(hh));
        fecha.setMinutes(Number(mm));
        fecha.setSeconds(0);
        fecha.setMilliseconds(0);

        if (fecha >= ahora) {

            proximos.push({
                hora,
                fecha
            });

        }

    });

    proximos = proximos.slice(0,3);

    contenedor.innerHTML = "";

    if(proximos.length === 0){

        contenedor.innerHTML = `
        <div class="card">

            <div class="estado">
                Sin servicios
            </div>

            <div class="hora">
                --
            </div>

            <div class="contador">
                No quedan trenes hoy
            </div>

        </div>
        `;

        return;
    }

    proximos.forEach(tren=>{

        const segundos = Math.floor((tren.fecha-ahora)/1000);

        const min = Math.floor(segundos/60);

        const seg = segundos%60;

        let estado="⚒ PROGRAMADO";
        let color="#FFD54A";

        if(segundos<=60 && segundos>0){

            estado="🚆 POR SALIR";
            color="#4CAF50";

        }

        if(segundos<=0){

            estado="🚉 SALIENDO";
            color="#F44336";

        }

        contenedor.innerHTML += `

        <div class="card">

            <div class="estado"
            style="background:${color};">
                ${estado}
            </div>

            <div class="hora">
                ${tren.hora}
            </div>

            <div class="contador">
                Sale en
                ${String(min).padStart(2,"0")}:${String(seg).padStart(2,"0")}
            </div>

            <div class="destino">
                ${sentidoSelect.options[sentidoSelect.selectedIndex].text}
            </div>

        </div>

        `;

    });

}

// Eventos
estacionSelect.addEventListener("change", actualizarTodo);
sentidoSelect.addEventListener("change", actualizarTodo);

// Iniciar
cargarHorarios();
