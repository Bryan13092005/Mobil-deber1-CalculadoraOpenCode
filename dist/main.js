import { evaluarBimestres, evaluarSupletorio, validarNotaBimestre, validarNotaSupletorio, } from "./logica.js";
const $ = (id) => document.getElementById(id);
const inputB1 = $("bimestre1");
const inputB2 = $("bimestre2");
const btnCalcular = $("btnCalcular");
const errB1 = $("errB1");
const errB2 = $("errB2");
const resultado = $("resultado");
const seccionSupletorio = $("seccionSupletorio");
const inputSupletorio = $("supletorio");
const errSup = $("errSupletorio");
const btnSupletorio = $("btnSupletorio");
const resultadoSupletorio = $("resultadoSupletorio");
let sumaActual = null;
function limpiar() {
    errB1.textContent = "";
    errB2.textContent = "";
    resultado.innerHTML = "";
    seccionSupletorio.hidden = true;
    resultadoSupletorio.innerHTML = "";
    errSup.textContent = "";
    inputSupletorio.value = "";
    sumaActual = null;
}
btnCalcular.addEventListener("click", () => {
    limpiar();
    const v1 = validarNotaBimestre(inputB1.value);
    const v2 = validarNotaBimestre(inputB2.value);
    if (!v1.ok)
        errB1.textContent = v1.error;
    if (!v2.ok)
        errB2.textContent = v2.error;
    if (!v1.ok || !v2.ok)
        return;
    const r = evaluarBimestres(v1.nota, v2.nota);
    if (r.tipo === "directo") {
        resultado.innerHTML = `
      <p><strong>Suma de bimestres:</strong> ${r.sumaBimestres}</p>
      <p class="estado ${r.estado === "APROBADO DIRECTAMENTE" ? "ok" : "mal"}">${r.estado}</p>
      <p>${r.mensaje}</p>`;
        return;
    }
    sumaActual = r.sumaBimestres;
    resultado.innerHTML = `
    <p><strong>Suma de bimestres:</strong> ${r.sumaBimestres}</p>
    <p class="estado aviso">${r.estado}</p>
    <p>${r.mensaje}</p>
    <p class="destacado">Necesitas como mínimo <strong>${r.notaNecesaria}</strong> puntos en el supletorio para aprobar.</p>`;
    seccionSupletorio.hidden = false;
});
btnSupletorio.addEventListener("click", () => {
    errSup.textContent = "";
    resultadoSupletorio.innerHTML = "";
    if (sumaActual === null)
        return;
    const v = validarNotaSupletorio(inputSupletorio.value);
    if (!v.ok) {
        errSup.textContent = v.error;
        return;
    }
    const r = evaluarSupletorio(sumaActual, v.nota);
    const clase = r.estado === "APROBADO POR SUPLETORIO" ? "ok" : "mal";
    resultadoSupletorio.innerHTML = `
    ${r.notaFinal !== null ? `<p><strong>Nota final:</strong> ${r.notaFinal}</p>` : ""}
    <p class="estado ${clase}">${r.estado}</p>
    <p>${r.mensaje}</p>`;
});
