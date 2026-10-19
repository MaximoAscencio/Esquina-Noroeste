
function MatrizCostos({
  costos,
  oferta,
  demanda,
  actualizarCosto,
  actualizarOferta,
  actualizarDemanda
}) {
  return (
    <div className="seccion-matriz">
      <h3>Matriz de costos</h3>
      <p>
        Cada celda representa el costo de enviar una
        unidad de un origen a un destino.
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
            {costos.map((fila, i) => (
              <tr key={i}>
                <th>O{i + 1}</th>

                {fila.map((costo, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      aria-label={`Costo O${i + 1} D${j + 1}`}
                      value={costo}
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

                <td className="columna-oferta">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    aria-label={`Oferta O${i + 1}`}
                    value={oferta[i]}
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
                    onChange={e =>
                      actualizarDemanda(
                        j,
                        e.target.value
                      )
                    }
                  />
                </td>
              ))}

              <td className="celda-vacia">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MatrizCostos
