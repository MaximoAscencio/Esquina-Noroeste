
import { useState } from 'react'

function Resultados({ resultado }) {
  const [pasoActual, setPasoActual] = useState(0)

  // Validar que recibimos una solución
  if (!resultado) {
    return (
      <section className="resultados">
        <p>No hay resultados disponibles.</p>
      </section>
    )
  }

  const {
    costos = [],
    oferta = [],
    demanda = [],
    pasos = [],
    asignaciones = [],
    costoTotal = 0,
    totalUnidades = 0,
    ficticio = null,
    balanceadoOriginal = true,
    totalOfertaOriginal = 0,
    totalDemandaOriginal = 0
  } = resultado

  // Detectar información incompleta
  console.log('DATOS RECIBIDOS EN RESULTADOS:', resultado)
  
  const datosCompletos =
    Array.isArray(costos) &&
    Array.isArray(oferta) &&
    Array.isArray(demanda) &&
    Array.isArray(pasos) &&
    Array.isArray(asignaciones) &&
    costos.length > 0 &&
    demanda.length > 0 &&
    costos.length === oferta.length &&
    costos.every(
      fila => Array.isArray(fila) &&
      fila.length === demanda.length
    )

  if (!datosCompletos) {
    return (
      <section className="resultados">
        <h2>Error al mostrar la resolución</h2>
        <p>
          El algoritmo no devolvió una matriz completa.
          Revisa el archivo esquinaNoroeste.js.
        </p>
      </section>
    )
  }

  const terminado = pasoActual >= pasos.length

  const paso = pasoActual > 0
    ? pasos[Math.min(pasoActual, pasos.length) - 1]
    : null

  const matrizInicial = costos.map(
    fila => fila.map(() => 0)
  )

  const matrizActual = paso?.asignaciones ?? matrizInicial
  const ofertaActual = paso?.ofertaRestante ?? oferta
  const demandaActual = paso?.demandaRestante ?? demanda

  // Nombres de orígenes
  function nombreOrigen(i) {
    if (ficticio?.tipo === 'origen' && ficticio.indice === i) {
      return 'Origen ficticio'
    }

    return `O${i + 1}`
  }

  // Nombres de destinos
  function nombreDestino(j) {
    if (ficticio?.tipo === 'destino' && ficticio.indice === j) {
      return 'Destino ficticio'
    }

    return `D${j + 1}`
  }

  return (
    <section className="resultados">

      <h2>Resolución por Esquina Noroeste</h2>

      {/* ANÁLISIS INICIAL */}
      <h3>1. Análisis del problema</h3>

      <p>
        Oferta total: <strong>{totalOfertaOriginal}</strong>
      </p>

      <p>
        Demanda total: <strong>{totalDemandaOriginal}</strong>
      </p>

      {balanceadoOriginal ? (
        <p>
          El problema está balanceado.
          No necesitamos agregar orígenes ni destinos ficticios.
        </p>
      ) : (
        <div className="explicacion-paso">
          <h4>Balanceo automático</h4>

          {ficticio ? (
            <p>
              Se agregó un {ficticio.tipo} ficticio con
              {' '}{ficticio.cantidad} unidades y costos
              unitarios de cero.
            </p>
          ) : (
            <p>
              El problema necesita balanceo, pero no
              se recibieron los datos del elemento ficticio.
            </p>
          )}
        </div>
      )}

      {/* TABLA DE TRANSPORTE */}
      <h3>2. Matriz de transporte</h3>

      <div className="tabla-scroll">
        <table className="tabla-resultado">

          <thead>
            <tr>
              <th>Origen</th>

              {demanda.map((_, j) => (
                <th key={j}>{nombreDestino(j)}</th>
              ))}

              <th>Oferta restante</th>
            </tr>
          </thead>

          <tbody>
            {costos.map((fila, i) => (
              <tr key={i}>
                <th>{nombreOrigen(i)}</th>

                {fila.map((costo, j) => {
                  const activa =
                    paso?.fila === i &&
                    paso?.columna === j

                  return (
                    <td
                      key={j}
                      className={activa ? 'celda-activa' : ''}
                    >
                      <span className="costo-unitario">
                        Costo: {costo}
                      </span>

                      <strong className="cantidad-asignada">
                        {matrizActual[i]?.[j] ?? 0}
                      </strong>
                    </td>
                  )
                })}

                <td>{ofertaActual[i] ?? 0}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Demanda restante</th>

              {demanda.map((_, j) => (
                <th key={j}>
                  {demandaActual[j] ?? 0}
                </th>
              ))}

              <th>—</th>
            </tr>
          </tfoot>

        </table>
      </div>

      {/* PROCEDIMIENTO */}
      <h3>3. Procedimiento paso a paso</h3>

      <div className="explicacion-paso">

        <h4>
          {paso
            ? `Paso ${pasoActual} de ${pasos.length}`
            : 'Estado inicial'}
        </h4>

        {!paso ? (
          <p>
            Iniciamos en la esquina superior izquierda
            de la matriz. Presiona «Siguiente» para
            realizar la primera asignación.
          </p>
        ) : (
          <>
            <p>
              <strong>Celda seleccionada:</strong>
              {' '}{paso.origen} → {paso.destino}.
            </p>

            <p>
              Oferta disponible: {paso.ofertaAnterior}.
              <br />
              Demanda pendiente: {paso.demandaAnterior}.
            </p>

            <p>
              <strong>Cálculo de asignación:</strong>
              {' '}mínimo({paso.ofertaAnterior},
              {' '}{paso.demandaAnterior})
              {' '}= {paso.cantidad} unidades.
            </p>

            <p>
              <strong>Costo de esta operación:</strong>
              {' '}{paso.cantidad} × {paso.costoUnitario}
              {' '}= {paso.costoPaso}.
            </p>

            <p>
              <strong>Costo acumulado:</strong>
              {' '}{paso.costoAcumulado}.
            </p>

            {paso.esFicticio && (
              <p>
                Esta asignación corresponde a un
                elemento ficticio y su costo es cero.
              </p>
            )}

            <p>
              {paso.ofertaRestante?.[paso.fila] === 0 &&
               paso.demandaRestante?.[paso.columna] === 0
                ? 'Se agotó la oferta y se satisfizo la demanda.'
                : paso.ofertaRestante?.[paso.fila] === 0
                  ? 'Se agotó la oferta. Avanzamos al siguiente origen.'
                  : 'Se satisfizo la demanda. Avanzamos al siguiente destino.'}
            </p>
          </>
        )}

      </div>

      {/* NAVEGACIÓN */}
      <div className="controles-pasos">

        <button
          type="button"
          disabled={pasoActual === 0}
          onClick={() =>
            setPasoActual(actual => Math.max(0, actual - 1))
          }
        >
          Anterior
        </button>

        <span>
          Paso {pasoActual} / {pasos.length}
        </span>

        <button
          type="button"
          disabled={terminado}
          onClick={() =>
            setPasoActual(actual =>
              Math.min(pasos.length, actual + 1)
            )
          }
        >
          Siguiente
        </button>

      </div>

      {/* CONCLUSIÓN */}
      {terminado && (
        <div className="conclusion">

          <h3>4. Resultado y conclusión</h3>

          <h4>Asignaciones finales</h4>

          <ul>
            {asignaciones.flatMap((fila, i) =>
              fila.map((cantidad, j) =>
                cantidad > 0 ? (
                  <li key={`${i}-${j}`}>
                    {nombreOrigen(i)} → {nombreDestino(j)}:
                    {' '}{cantidad} × {costos[i][j]}
                    {' '}= {cantidad * costos[i][j]}
                  </li>
                ) : null
              )
            )}
          </ul>

          <p className="costo-final">
            Costo total: {costoTotal}
          </p>

          <p>
            <strong>Conclusión:</strong> Mediante el
            Método de la Esquina Noroeste se realizaron
            asignaciones por un total de {totalUnidades}
            {' '}unidades dentro del modelo balanceado.
          </p>

          {ficticio?.tipo === 'destino' && (
            <p>
              Se asignaron {ficticio.cantidad} unidades
              al destino ficticio, representando
              oferta no utilizada para destinos reales.
            </p>
          )}

          {ficticio?.tipo === 'origen' && (
            <p>
              El origen ficticio representa
              {' '}{ficticio.cantidad} unidades
              de demanda no cubierta por la oferta real.
            </p>
          )}

          <p>
            El costo total calculado es de
            <strong> {costoTotal}</strong> unidades monetarias.
            Esta es una solución inicial factible del
            modelo balanceado, pero no necesariamente
            representa el costo mínimo posible.
          </p>

          <button
            type="button"
            onClick={() => setPasoActual(0)}
          >
            Revisar desde el inicio
          </button>

        </div>
      )}

    </section>
  )
}

export default Resultados
