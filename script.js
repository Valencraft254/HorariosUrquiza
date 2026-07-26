const horarios = []; // Se cargarán desde horarios.json

const contenedor = document.getElementById("trenes");
const estacion = document.getElementById("estacion");
const sentido = document.getElementById("sentido");

async function cargarHorarios() {
    const res = await fetch("horarios.json");
    const data = await res.json();

    horarios.push(...data);

    actualizar();
    setInterval(actualizar, 1000);
}

function actualizarHora() {
    const ahora = new Date();

    document.getElementById("hora").textContent =
        ahora.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    return ahora;
}

function actualizar() {

    const ahora = actualizarHora();

    const lista = horarios
        .filter(h =>
            h.estacion === estacion.value &&
            h.sentido === sentido.value
        )
        .filter(h => {

            const [hh, mm] = h.hora.split(":");

            const fecha = new Date();

            fecha.setHours(hh);
            fecha.setMinutes(mm);
            fecha.setSeconds(0);

            h.fecha = fecha;

            return fecha >= ahora;
        })
        .sort((a,b)=>a.fecha-b.fecha)
        .slice(0,3);

    contenedor.innerHTML="";

    lista.forEach(tren=>{

        const segundos = Math.floor((tren.fecha-ahora)/1000);

        const min = Math.floor(segundos/60);
        const seg = segundos%60;

        contenedor.innerHTML += `
        <div class="card">

            <div class="estado">⚒ PROGRAMADO</div>

            <div class="hora">${tren.hora}</div>

            <div class="contador">
                Sale en ${min}:${String(seg).padStart(2,"0")}
            </div>

            <div class="destino">
                ${tren.sentido}
            </div>

        </div>
        `;

    });

}

estacion.onchange = actualizar;
sentido.onchange = actualizar;

cargarHorarios();
