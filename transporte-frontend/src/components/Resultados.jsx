
import { useState } from 'react'

function Resultados({ resultado }) {
  const [pasoActual, setPasoActual] = useState(0)

  const {
    costos,
    oferta,
    demanda,
    pasos,
    asignaciones,
    costoTotal,
    totalUnidades,
    ficticio,
    balanceadoOriginal,
    totalOfertaOriginal,
    totalDemandaOriginal
  } = resultado

  const terminado = pasoActual === pasos.length
  const paso = pasoActual > 0 ? pasos[pasoActual - 1] : null

  const matrizActual = paso
    ? paso.asignaciones
    : costos.map(fila => fila.map(() => 0))

  const ofertaActual = paso ? paso.ofertaRestante : oferta
  const demandaActual = paso ? paso.demandaRestante : demanda

  function nombreOrigen(i) {
    return ficticio?.tipo === 'origen' && ficticio.indice === i
      ? 'Origen ficticio'
      : `O${i + 1}`
  }

  function nombreDestino(j) {
    return ficticio?.tipo === 'destino' && ficticio.indice === j
      ? 'Destino ficticio'
      : `D${j + 1}`
  }

  return (
    <section className="resultados">

      <h2>Resolución por Esquina Noroeste</h2>

      <h3>1. Análisis del problema</h3>

      <p>Oferta original: <strong>{totalOfertaOriginal}</strong></p>
      <p>Demanda original: <strong>{totalDemandaOriginal}</strong></p>

      {balanceadoOriginal ? (
        <p>
          El problema está balanceado. No se necesitan
          orígenes ni destinos ficticios.
        </p>
      ) : (
        <div className="explicacion-paso">
          <h4>Balanceo automático</h4>

          <p>
            El problema original no está balanceado.
            Se agregó un <strong>{ficticio.tipo} ficticio</strong>
            {' '}con {ficticio.cantidad} unidades
            y costos unitarios iguales a cero.
          </p>
        </div>
      )}

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

                {fila.map((costo, j) => (
                  <td
                    key={j}
                    className={
                      paso?.fila === i && paso?.columna === j
                        ? 'celda-activa'
                        : ''
                    }
                  >
                    <span className="costo-unitario">
                      Costo: {costo}
                    </span>

                    <strong className="cantidad-asignada">
                      {matrizActual[i][j]}
                    </strong>
                  </td>
                ))}

                <td>{ofertaActual[i]}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Demanda restante</th>
              {demandaActual.map((valor, j) => (
                <th key={j}>{valor}</th>
              ))}
              <th>—</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <h3>3. Procedimiento paso a paso</h3>

      <div className="explicacion-paso">
        <h4>
          {paso
            ? `Paso ${pasoActual} de ${pasos.length}`
            : 'Estado inicial'}
        </h4>

        {!paso ? (
          <p>
            Comenzaremos en la esquina superior izquierda.
            Presiona «Siguiente» para asignar unidades.
          </p>
        ) : (
          <>
            <p>
              Celda seleccionada:
              <strong> {paso.origen} → {paso.destino}</strong>.
            </p>

            <p>
              Oferta disponible: {paso.ofertaAnterior}.
              Demanda pendiente: {paso.demandaAnterior}.
            </p>

            <p>
              Asignación = mínimo({paso.ofertaAnterior},
              {' '}{paso.demandaAnterior}) =
              <strong> {paso.cantidad}</strong> unidades.
            </p>

            <p>
              Costo del paso: {paso.cantidad} ×
              {' '}{paso.costoUnitario} =
              <strong> {paso.costoPaso}</strong>.
            </p>

            <p>
              Costo acumulado:
              <strong> {paso.costoAcumulado}</strong>.
            </p>

            {paso.esFicticio && (
              <p>
                Esta es una asignación ficticia.
                No genera un costo de transporte real.
              </p>
            )}

            <p>
              {paso.ofertaRestante[paso.fila] === 0 &&
               paso.demandaRestante[paso.columna] === 0
                ? 'Se agotó la oferta y se satisfizo la demanda.'
                : paso.ofertaRestante[paso.fila] === 0
                  ? 'Se agotó la oferta. Avanzamos al siguiente origen.'
                  : 'Se satisfizo la demanda. Avanzamos al siguiente destino.'}
            </p>
          </>
        )}
      </div>

      <div className="controles-pasos">
        <button
          type="button"
          disabled={pasoActual === 0}
          onClick={() => setPasoActual(actual => actual - 1)}
        >
          Anterior
        </button>

        <span>Paso {pasoActual} / {pasos.length}</span>

        <button
          type="button"
          disabled={terminado}
          onClick={() => setPasoActual(actual => actual + 1)}
        >
          Siguiente
        </button>
      </div>

      {terminado && (
        <div className="conclusion">

          <h3>4. Resultado y conclusión</h3>

          <h4>Asignaciones realizadas</h4>

          <ul>
            {asignaciones.flatMap((fila, i) =>
              fila.map((cantidad, j) =>
                cantidad > 0 ? (
                  <li key={`${i}-${j}`}>
                    {nombreOrigen(i)} → {nombreDestino(j)}:
                    {' '}{cantidad} × {costos[i][j]} =
                    {' '}{cantidad * costos[i][j]}
                  </li>
                ) : null
              )
            )}
          </ul>

          <p className="costo-final">
            Costo total: {costoTotal}
          </p>

          <p>
            <strong>Conclusión:</strong> Se resolvió
            el problema mediante el Método de la
            Esquina Noroeste, realizando asignaciones
            por un total de {totalUnidades} unidades
            en el modelo balanceado.
          </p>

          {ficticio?.tipo === 'destino' && (
            <p>
              De estas, {ficticio.cantidad} unidades
              corresponden al destino ficticio y
              representan oferta disponible no utilizada.
            </p>
          )}

          {ficticio?.tipo === 'origen' && (
            <p>
              El origen ficticio aporta {ficticio.cantidad}
              {' '}unidades en el modelo, que representan
              demanda no cubierta por los orígenes reales.
            </p>
          )}

          <p>
            El costo total obtenido es de {costoTotal}
            {' '}unidades monetarias. La solución
            corresponde al Método de la Esquina Noroeste
            y no garantiza el costo mínimo posible.
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
