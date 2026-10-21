function MatrizCostos({
  costos,
  oferta,
  demanda,
  actualizarCosto,
  actualizarOferta,
  actualizarDemanda,
  totalOferta,
  totalDemanda,
  balanceado
}) {

  // Seleccionar el contenido al entrar en una celda
  function seleccionarContenido(evento) {
    evento.target.select()
  }

  return (
    <div className="seccion-matriz">

      <h3>Matriz de costos</h3>

      <p>
        Cada celda representa el costo de enviar una
        unidad desde un origen hasta un destino.
      </p>

      <div className="tabla-contenedor">

        <table className="tabla-transporte">

          <thead>
            <tr>
              <th>Origen / Destino</th>

              {demanda.map((_, j) => (
                <th key={j}>D{j + 1}</th>
              ))}

              <th className="columna-oferta">
                Oferta
              </th>
            </tr>
          </thead>

          <tbody>

            {/* FILAS DE ORÍGENES */}
            {costos.map((fila, i) => (
              <tr key={i}>

                <th>O{i + 1}</th>

                {/* COSTOS UNITARIOS */}
                {fila.map((costo, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      aria-label={`Costo O${i + 1} D${j + 1}`}
                      value={costo}
                      onFocus={seleccionarContenido}
                      onChange={e =>
                        actualizarCosto(
                          i,
                          j,
                          e.target.value
                        )
                      }
                    />
                  </td>
                ))}

                {/* OFERTA DEL ORIGEN */}
                <td className="columna-oferta">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    aria-label={`Oferta O${i + 1}`}
                    value={oferta[i]}
                    onFocus={seleccionarContenido}
                    onChange={e =>
                      actualizarOferta(
                        i,
                        e.target.value
                      )
                    }
                  />
                </td>

              </tr>
            ))}

            {/* FILA DE DEMANDAS */}
            <tr className="fila-demanda">

              <th>Demanda</th>

              {demanda.map((cantidad, j) => (
                <td key={j}>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    aria-label={`Demanda D${j + 1}`}
                    value={cantidad}
                    onFocus={seleccionarContenido}
                    onChange={e =>
                      actualizarDemanda(
                        j,
                        e.target.value
                      )
                    }
                  />
                </td>
              ))}

              
              {/* Totales en la esquina inferior derecha */}
              <td
                className={`celda-balance ${
                  balanceado ? 'celda-balance--ok' : 'celda-balance--error'
                }`}
                aria-label={`Oferta total: ${totalOferta}. Demanda total: ${totalDemanda}. ${
                  balanceado ? 'Problema balanceado' : 'Problema no balanceado'
                }`}
              >
                <svg
                  className="celda-balance__diagonal"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="100"
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <span className="celda-balance__oferta">
                  <small>Oferta</small>
                  <strong>{totalOferta}</strong>
                </span>

                <span className="celda-balance__demanda">
                  <small>Demanda</small>
                  <strong>{totalDemanda}</strong>
                </span>
              </td>


            </tr>

          </tbody>
        </table>
      </div>

    </div>
  )
}

export default MatrizCostos
