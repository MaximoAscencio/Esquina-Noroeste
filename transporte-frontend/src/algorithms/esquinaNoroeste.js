
export function esquinaNoroeste(costos, oferta, demanda) {
  const EPS = 1e-9

  if (
    !oferta.length ||
    !demanda.length ||
    costos.length !== oferta.length ||
    costos.some(fila => fila.length !== demanda.length)
  ) {
    throw new Error('Las dimensiones de la matriz no coinciden.')
  }

  const valores = [...costos.flat(), ...oferta, ...demanda]

  if (valores.some(valor =>
    !Number.isFinite(valor) || valor < 0
  )) {
    throw new Error('Todos los valores deben ser números no negativos.')
  }

  const costosBalanceados = costos.map(fila => [...fila])
  const ofertaBalanceada = [...oferta]
  const demandaBalanceada = [...demanda]

  const totalOferta = oferta.reduce((a, b) => a + b, 0)
  const totalDemanda = demanda.reduce((a, b) => a + b, 0)

  if (totalOferta <= EPS && totalDemanda <= EPS) {
    throw new Error('Debes introducir oferta o demanda positiva.')
  }

  let ficticio = null

  // BALANCEAR EL PROBLEMA AUTOMÁTICAMENTE
  if (totalOferta > totalDemanda + EPS) {
    const diferencia = totalOferta - totalDemanda

    demandaBalanceada.push(diferencia)

    costosBalanceados.forEach(fila => {
      fila.push(0)
    })

    ficticio = {
      tipo: 'destino',
      indice: demandaBalanceada.length - 1,
      cantidad: diferencia
    }

  } else if (totalDemanda > totalOferta + EPS) {
    const diferencia = totalDemanda - totalOferta

    ofertaBalanceada.push(diferencia)

    costosBalanceados.push(
      Array(demandaBalanceada.length).fill(0)
    )

    ficticio = {
      tipo: 'origen',
      indice: ofertaBalanceada.length - 1,
      cantidad: diferencia
    }
  }

  const filas = ofertaBalanceada.length
  const columnas = demandaBalanceada.length

  const ofertaRestante = [...ofertaBalanceada]
  const demandaRestante = [...demandaBalanceada]

  const asignaciones = Array.from(
    { length: filas },
    () => Array(columnas).fill(0)
  )

  const pasos = []

  let fila = 0
  let columna = 0
  let costoTotal = 0

  // MÉTODO DE LA ESQUINA NOROESTE
  while (fila < filas && columna < columnas) {

    const disponible = ofertaRestante[fila]
    const requerido = demandaRestante[columna]

    // Saltar filas o columnas ya agotadas
    if (disponible <= EPS && fila < filas - 1) {
      fila++
      continue
    }

    if (requerido <= EPS && columna < columnas - 1) {
      columna++
      continue
    }

    const cantidad = Math.min(disponible, requerido)

    if (cantidad <= EPS) {
        if (disponible <= EPS) {
            fila++
        } else {
            columna++
        }
        continue
    }

    const costoUnitario = costosBalanceados[fila][columna]
    const costoPaso = cantidad * costoUnitario

    asignaciones[fila][columna] += cantidad
    costoTotal += costoPaso

    ofertaRestante[fila] = Math.max(0, disponible - cantidad)
    demandaRestante[columna] = Math.max(0, requerido - cantidad)

    const origenFicticio =
      ficticio?.tipo === 'origen' &&
      ficticio.indice === fila

    const destinoFicticio =
      ficticio?.tipo === 'destino' &&
      ficticio.indice === columna

    pasos.push({
      numero: pasos.length + 1,
      fila,
      columna,
      origen: origenFicticio ? 'Origen ficticio' : `O${fila + 1}`,
      destino: destinoFicticio ? 'Destino ficticio' : `D${columna + 1}`,
      esFicticio: origenFicticio || destinoFicticio,
      ofertaAnterior: disponible,
      demandaAnterior: requerido,
      cantidad,
      costoUnitario,
      costoPaso,
      costoAcumulado: costoTotal,
      ofertaRestante: [...ofertaRestante],
      demandaRestante: [...demandaRestante],
      asignaciones: asignaciones.map(f => [...f])
    })

    const ofertaAgotada = ofertaRestante[fila] <= EPS
    const demandaSatisfecha = demandaRestante[columna] <= EPS

    if (ofertaAgotada && demandaSatisfecha) {
      fila++
      columna++
    } else if (ofertaAgotada) {
      fila++
    } else if (demandaSatisfecha) {
      columna++
    }
  }

  return {
    costos: costosBalanceados,
    oferta: ofertaBalanceada,
    demanda: demandaBalanceada,
    asignaciones,
    pasos,
    costoTotal,
    totalUnidades: Math.max(totalOferta, totalDemanda),
    totalOfertaOriginal: totalOferta,
    totalDemandaOriginal: totalDemanda,
    ficticio,
    balanceadoOriginal: ficticio === null
  }
}
