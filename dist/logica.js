/**
 * Logica academica de la Calculadora de Aprobacion EPN.
 * Separada de la interfaz para poder probarse y reutilizarse.
 */
export const MAX_BIMESTRE = 20;
export const SUMA_APROBACION_DIRECTA = 28;
export const SUMA_MIN_SUPLETORIO = 18;
export const NOTA_MIN_SUPLETORIO = 24;
export const MAX_SUPLETORIO = 40;
export const NOTA_MIN_APROBACION_SUPLETORIO = 48;
/** Redondea a 2 decimales para evitar errores de punto flotante. */
export function redondear(n) {
    return Math.round(n * 100) / 100;
}
/** Valida una nota de bimestre (0 a 20, numerica, no negativa). */
export function validarNotaBimestre(valor) {
    const limpio = valor.trim().replace(",", ".");
    if (limpio === "")
        return { ok: false, error: "Ingrese una nota." };
    const nota = Number(limpio);
    if (!Number.isFinite(nota))
        return { ok: false, error: "La nota debe ser un numero valido." };
    if (nota < 0)
        return { ok: false, error: "La nota no puede ser negativa." };
    if (nota > MAX_BIMESTRE)
        return { ok: false, error: `La nota no puede superar ${MAX_BIMESTRE}.` };
    return { ok: true, nota: redondear(nota) };
}
/** Valida la nota del supletorio (0 a 40, numerica). */
export function validarNotaSupletorio(valor) {
    const limpio = valor.trim().replace(",", ".");
    if (limpio === "")
        return { ok: false, error: "Ingrese la nota del supletorio." };
    const nota = Number(limpio);
    if (!Number.isFinite(nota))
        return { ok: false, error: "La nota debe ser un numero valido." };
    if (nota < 0)
        return { ok: false, error: "La nota no puede ser negativa." };
    if (nota > MAX_SUPLETORIO)
        return { ok: false, error: `La nota del supletorio no puede superar ${MAX_SUPLETORIO}.` };
    return { ok: true, nota: redondear(nota) };
}
/** Nota minima necesaria en el supletorio para aprobar. */
export function notaNecesariaEnSupletorio(sumaBimestres) {
    return redondear(Math.max(NOTA_MIN_SUPLETORIO, NOTA_MIN_APROBACION_SUPLETORIO - sumaBimestres));
}
/**
 * Evalua la suma de bimestres siguiendo exactamente el orden de decision:
 * 1) suma >= 28 -> APROBADO DIRECTAMENTE
 * 2) suma < 18  -> REPROBADO directamente (sin supletorio)
 * 3) 18 <= suma < 28 -> derecho a supletorio
 */
export function evaluarBimestres(bimestre1, bimestre2) {
    const suma = redondear(bimestre1 + bimestre2);
    if (suma >= SUMA_APROBACION_DIRECTA) {
        return {
            tipo: "directo",
            estado: "APROBADO DIRECTAMENTE",
            sumaBimestres: suma,
            mensaje: `Suma de bimestres ${suma} >= ${SUMA_APROBACION_DIRECTA}. Aprobaste directamente; no necesitas supletorio.`,
        };
    }
    if (suma < SUMA_MIN_SUPLETORIO) {
        return {
            tipo: "directo",
            estado: "REPROBADO",
            sumaBimestres: suma,
            mensaje: `Suma de bimestres ${suma} < ${SUMA_MIN_SUPLETORIO}. Reprobaste directamente; no tienes derecho a supletorio.`,
        };
    }
    return {
        tipo: "supletorio",
        estado: "VA A SUPLETORIO",
        sumaBimestres: suma,
        notaNecesaria: notaNecesariaEnSupletorio(suma),
        mensaje: `Suma de bimestres ${suma}. Tienes derecho a rendir el examen supletorio.`,
    };
}
/**
 * Evalua el supletorio. Regla clave: una nota menor a 24 reprueba
 * aunque la suma de bimestres sea alta; el minimo de 24 es obligatorio.
 */
export function evaluarSupletorio(sumaBimestres, notaSupletorio) {
    if (notaSupletorio < NOTA_MIN_SUPLETORIO) {
        return {
            estado: "REPROBADO",
            notaFinal: null,
            mensaje: `Supletorio ${notaSupletorio} < ${NOTA_MIN_SUPLETORIO}. El minimo de ${NOTA_MIN_SUPLETORIO} puntos es obligatorio: REPROBADO.`,
        };
    }
    const notaFinal = redondear(sumaBimestres + notaSupletorio);
    if (notaFinal >= NOTA_MIN_APROBACION_SUPLETORIO) {
        return {
            estado: "APROBADO POR SUPLETORIO",
            notaFinal,
            mensaje: `Nota final ${notaFinal} >= ${NOTA_MIN_APROBACION_SUPLETORIO}. APROBADO POR SUPLETORIO.`,
        };
    }
    return {
        estado: "REPROBADO",
        notaFinal,
        mensaje: `Nota final ${notaFinal} < ${NOTA_MIN_APROBACION_SUPLETORIO}. REPROBADO.`,
    };
}
