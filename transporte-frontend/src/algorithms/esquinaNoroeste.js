
export function esquinaNoroeste(costos, oferta, demanda) {
  const filas = oferta.length
  const columnas = demanda.length

  if (
    !filas || !columnas ||
    costos.length !== filas ||
    costos.some(fila => fila.length !== columnas)
  ) {
    throw new Error('Las dimensiones de la matriz no coinciden.')
  }

  const valores = [...costos.flat(), ...oferta, ...demanda]

  if (valores.some(valor =>
    !Number.isFinite(valor) || valor < 0
  )) {
    throw new Error('Los datos deben ser números no negativos.')
  }

  const sumaOferta = oferta.reduce((a, b) => a + b, 0)
  const sumaDemanda = demanda.reduce((a, b) => a + b, 0)

  if (sumaOferta <= 0 || Math.abs(sumaOferta - sumaDemanda) > 1e-9) {
    throw new Error('El problema debe estar balanceado.')
  }

  const ofertaRestante = [...oferta]
  const demandaRestante = [...demanda]

  const asignaciones = Array.from(
    { length: filas },
    () => Array(columnas).fill(0)
  )

  const pasos = []
  let fila = 0
  let columna = 0
  let costoTotal = 0

  const epsilon = 1e-9

  while (fila < filas && columna < columnas) {
    const disponible = ofertaRestante[fila]
    const requerido = demandaRestante[columna]

    const cantidad = Math.min(disponible, requerido)
    const costoUnitario = costos[fila][columna]
    const costoPaso = cantidad * costoUnitario

    asignaciones[fila][columna] = cantidad
    costoTotal += costoPaso

    ofertaRestante[fila] = Math.max(0, disponible - cantidad)
    demandaRestante[columna] = Math.max(0, requerido - cantidad)

    pasos.push({
      numero: pasos.length + 1,
      fila,
      columna,
      origen: `O${fila + 1}`,
      destino: `D${columna + 1}`,
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

    const ofertaAgotada = ofertaRestante[fila] <= epsilon
    const demandaSatisfecha = demandaRestante[columna] <= epsilon

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
    asignaciones,
    pasos,
    costoTotal,
    totalUnidades: sumaOferta
  }
}
