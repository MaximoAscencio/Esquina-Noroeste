
import { useState } from 'react'
import MatrizCostos from './components/MatrizCostos'
import ConfiguracionProblema from './components/ConfiguracionProblema'
import Resultados from './components/Resultados'
import { esquinaNoroeste } from './algorithms/esquinaNoroeste'
import './App.css'
import './tema.css'

const costosIniciales = [
  [10, 2, 20, 11],
  [12, 7, 9, 20],
  [4, 14, 16, 18]
]

const ofertaInicial = [15, 25, 10]
const demandaInicial = [5, 15, 15, 15]

// Convertir datos numéricos a texto para los campos
const comoTexto = valores => valores.map(String)
const matrizComoTexto = matriz =>
  matriz.map(fila => fila.map(String))

function App() {
  const [costos, setCostos] = useState(
    () => matrizComoTexto(costosIniciales)
  )
  const [oferta, setOferta] = useState(
    () => comoTexto(ofertaInicial)
  )
  const [demanda, setDemanda] = useState(
    () => comoTexto(demandaInicial)
  )

  const [resultado, setResultado] = useState(null)
  const [datosResueltos, setDatosResueltos] = useState(null)
  const [error, setError] = useState('')

  // Conservar exactamente lo escrito
  function convertirValor(valor) {
    return valor
  }

  function actualizarCosto(fila, columna, valor) {
    setCostos(actual =>
      actual.map((filaActual, i) =>
        filaActual.map((costo, j) =>
          i === fila && j === columna
            ? convertirValor(valor)
            : costo
        )
      )
    )
  }

  function actualizarOferta(fila, valor) {
    setOferta(actual =>
      actual.map((cantidad, i) =>
        i === fila ? convertirValor(valor) : cantidad
      )
    )
  }

  function actualizarDemanda(columna, valor) {
    setDemanda(actual =>
      actual.map((cantidad, j) =>
        j === columna ? convertirValor(valor) : cantidad
      )
    )
  }

  // De 1 a 10 orígenes
  function cambiarOrigenes(valor) {
    const cantidad = Number(valor)

    if (!Number.isInteger(cantidad) ||
        cantidad < 1 || cantidad > 10) return

    setCostos(actual =>
      Array.from(
        { length: cantidad },
        (_, i) => actual[i]
          ? [...actual[i]]
          : Array(demanda.length).fill('0')
      )
    )

    setOferta(actual =>
      Array.from(
        { length: cantidad },
        (_, i) => actual[i] ?? '0'
      )
    )
  }

  // De 1 a 10 destinos
  function cambiarDestinos(valor) {
    const cantidad = Number(valor)

    if (!Number.isInteger(cantidad) ||
        cantidad < 1 || cantidad > 10) return

    setCostos(actual =>
      actual.map(fila =>
        Array.from(
          { length: cantidad },
          (_, j) => fila[j] ?? '0'
        )
      )
    )

    setDemanda(actual =>
      Array.from(
        { length: cantidad },
        (_, j) => actual[j] ?? '0'
      )
    )
  }

  function restaurarEjemplo() {
    setCostos(matrizComoTexto(costosIniciales))
    setOferta(comoTexto(ofertaInicial))
    setDemanda(comoTexto(demandaInicial))

    setResultado(null)
    setDatosResueltos(null)
    setError('')
  }

  const valores = [...costos.flat(), ...oferta, ...demanda]

  const datosValidos = valores.every(valor =>
    valor !== '' &&
    valor.trim() !== '' &&
    Number.isFinite(Number(valor)) &&
    Number(valor) >= 0
  )

  const totalOferta = oferta.reduce(
    (suma, valor) => suma + Number(valor || 0), 0
  )

  const totalDemanda = demanda.reduce(
    (suma, valor) => suma + Number(valor || 0), 0
  )

  // Los problemas no balanceados también son válidos
  const puedeResolver =
    datosValidos &&
    (totalOferta > 0 || totalDemanda > 0)

  const balanceado =
    Math.abs(totalOferta - totalDemanda) < 1e-9

  // Comparar los datos actuales con los ya resueltos
  const datosActuales = JSON.stringify({
    costos: costos.map(fila => fila.map(Number)),
    oferta: oferta.map(Number),
    demanda: demanda.map(Number)
  })

  const resultadosVigentes =
    datosValidos &&
    datosResueltos !== null &&
    JSON.stringify(datosResueltos) === datosActuales

  function resolverProblema() {
    if (!puedeResolver) {
      setError('Introduce valores válidos y oferta o demanda positiva.')
      return
    }

    const datos = {
      costos: costos.map(fila => fila.map(Number)),
      oferta: oferta.map(Number),
      demanda: demanda.map(Number)
    }

    try {
      const solucion = esquinaNoroeste(
        datos.costos,
        datos.oferta,
        datos.demanda
      )
      console.log('SOLUCIÓN COMPLETA:', solucion)

      setResultado(solucion)
      setDatosResueltos(datos)
      setError('')
    } catch (err) {
      setResultado(null)
      setDatosResueltos(null)
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <main>
        <section className="presentacion">
          <h1>Método de la Esquina Noroeste</h1>
          <p>
            Resuelve problemas de transporte balanceados
            y no balanceados, mostrando cada asignación
            del Método de la Esquina Noroeste.
          </p>
        </section>

        <section className="panel">
          <div className="panel-encabezado">
            <div>
              <h2>Datos del problema</h2>
              <p>
                Ingresa los costos unitarios, las ofertas
                y las demandas.
              </p>
            </div>

            <button
              type="button"
              className="boton-secundario"
              onClick={restaurarEjemplo}
            >
              Restaurar ejemplo
            </button>
          </div>

          <ConfiguracionProblema
            numeroOrigenes={costos.length}
            numeroDestinos={demanda.length}
            cambiarOrigenes={cambiarOrigenes}
            cambiarDestinos={cambiarDestinos}
          />


          <MatrizCostos
            costos={costos}
            oferta={oferta}
            demanda={demanda}
            actualizarCosto={actualizarCosto}
            actualizarOferta={actualizarOferta}
            actualizarDemanda={actualizarDemanda}
            totalOferta={totalOferta}
            totalDemanda={totalDemanda}
            balanceado={datosValidos && puedeResolver && balanceado}
          />

          <div
            className={`estado ${
              !puedeResolver
                ? 'advertencia'
                : balanceado
                  ? 'correcto'
                  : 'advertencia'
            }`}
            role="status"
          >
            {!datosValidos
              ? 'Revisa los datos: hay valores inválidos o celdas vacías.'
              : !puedeResolver
                ? 'Ingresa una oferta o demanda positiva.'
                : balanceado
                  ? 'Problema balanceado: oferta y demanda coinciden.'
                  : 'Problema no balanceado: se agregará un origen o destino ficticio automáticamente.'}
          </div>

          <div className="acciones">
            <button
              type="button"
              className="boton-principal"
              disabled={!puedeResolver}
              onClick={resolverProblema}
            >
              Resolver por Esquina Noroeste
            </button>
          </div>

          {error && (
            <div className="estado advertencia" role="alert">
              {error}
            </div>
          )}
        </section>

        {resultado && resultadosVigentes && (
          <Resultados
            key={JSON.stringify(datosResueltos)}
            resultado={resultado}
          />
        )}
      </main>
    </div>
  )
}

export default App
