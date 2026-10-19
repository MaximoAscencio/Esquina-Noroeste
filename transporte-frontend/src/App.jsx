import { useState } from 'react'
import MatrizCostos from './components/MatrizCostos'
import ConfiguracionProblema from './components/ConfiguracionProblema'
import './App.css'

// Datos iniciales del problema de transporte
const costosIniciales = [
  [10, 2, 20, 11],
  [12, 7, 9, 20],
  [4, 14, 16, 18]
]

const ofertaInicial = [15, 25, 10]
const demandaInicial = [5, 15, 15, 15]

function App() {
  // Datos que puede modificar el usuario
  const [costos, setCostos] = useState(costosIniciales)
  const [oferta, setOferta] = useState(ofertaInicial)
  const [demanda, setDemanda] = useState(demandaInicial)
  const [mostrarJSON, setMostrarJSON] = useState(false)


  const datosParaEnviar = {
    costos: costos.map(fila => fila.map(Number)),
    oferta: oferta.map(Number),
    demanda: demanda.map(Number)
  }

  // Permite conservar una celda vacía mientras se edita
  function convertirValor(valor) {
    return valor === '' ? '' : Number(valor)
  }

  // Modificar un costo de la matriz
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

  // Modificar la oferta de un origen
  function actualizarOferta(fila, valor) {
    setOferta(actual =>
      actual.map((cantidad, i) =>
        i === fila ? convertirValor(valor) : cantidad
      )
    )
  }

  // Modificar la demanda de un destino
  function actualizarDemanda(columna, valor) {
    setDemanda(actual =>
      actual.map((cantidad, j) =>
        j === columna ? convertirValor(valor) : cantidad
      )
    )
  }

  // Cambiar el número de orígenes
  function cambiarOrigenes(valor) {
    const cantidad = Number(valor)

    setCostos(actual =>
      Array.from(
        { length: cantidad },
        (_, i) => actual[i] ?? Array(demanda.length).fill(0)
      )
    )

    setOferta(actual =>
      Array.from(
        { length: cantidad },
        (_, i) => actual[i] ?? 0
      )
    )
  }

  // Cambiar el número de destinos
  function cambiarDestinos(valor) {
    const cantidad = Number(valor)

    setCostos(actual =>
      actual.map(fila =>
        Array.from(
          { length: cantidad },
          (_, j) => fila[j] ?? 0
        )
      )
    )

    setDemanda(actual =>
      Array.from(
        { length: cantidad },
        (_, j) => actual[j] ?? 0
      )
    )
  }

  // Restaurar los datos originales
  function restaurarEjemplo() {
    setCostos(costosIniciales.map(fila => [...fila]))
    setOferta([...ofertaInicial])
    setDemanda([...demandaInicial])
  }

  // Totales de oferta y demanda
  const totalOferta = oferta.reduce(
    (suma, valor) => suma + Number(valor || 0), 0
  )

  const totalDemanda = demanda.reduce(
    (suma, valor) => suma + Number(valor || 0), 0
  )

  // Comprobación básica de los datos
  const valores = [...costos.flat(), ...oferta, ...demanda]

  const datosValidos = valores.every(
    valor =>
      valor !== '' &&
      Number.isFinite(Number(valor)) &&
      Number(valor) >= 0
  )

  const balanceado =
    datosValidos &&
    totalOferta > 0 &&
    Math.abs(totalOferta - totalDemanda) < 1e-9

  return (
    <div className="app">
      {/* ENCABEZADO */}
      <header className="encabezado">
        <div className="marca">
          <span className="marca-icono">↖</span>
          <span>Transporte<span className="marca-acento">IO</span></span>
        </div>

        <span className="encabezado-materia">
          Investigación de Operaciones
        </span>
      </header>

      <main>
        {/* PRESENTACIÓN */}
        <section className="presentacion">
          <span className="etiqueta">MODELO DE TRANSPORTE</span>

          <h1>Método de la Esquina Noroeste</h1>

          <p>
            Configura los orígenes, destinos y costos de
            transporte para preparar tu problema.
          </p>
        </section>

        {/* PANEL PRINCIPAL */}
        <section className="panel">
          <div className="panel-encabezado">
            <div>
              <h2>Datos del problema</h2>
              <p>
                Ingresa los costos unitarios, la oferta y
                la demanda.
              </p>
            </div>

            <button
              className="boton-secundario"
              type="button"
              onClick={restaurarEjemplo}
            >
              Restaurar ejemplo
            </button>
          </div>

          
            {/* CONFIGURACIÓN */}
            <ConfiguracionProblema
              numeroOrigenes={costos.length}
              numeroDestinos={demanda.length}
              cambiarOrigenes={cambiarOrigenes}
              cambiarDestinos={cambiarDestinos}
            />


        
            {/* MATRIZ */}
            <MatrizCostos
              costos={costos}
              oferta={oferta}
              demanda={demanda}
              actualizarCosto={actualizarCosto}
              actualizarOferta={actualizarOferta}
              actualizarDemanda={actualizarDemanda}
            />

            
            {/* RESUMEN DE OFERTA Y DEMANDA */}
            <div className="resumen">
              <div className="resumen-dato">
                <span>Oferta total</span>
                <strong>{totalOferta}</strong>
              </div>

              <div className="resumen-dato">
                <span>Demanda total</span>
                <strong>{totalDemanda}</strong>
              </div>
            </div>

            {/* ESTADO DEL PROBLEMA */}
            <div
              className={`estado ${balanceado ? 'correcto' : 'advertencia'}`}
              role="status"
            >
              {!datosValidos
                ? 'Revisa los datos: hay celdas vacías o valores negativos.'
                : balanceado
                  ? 'Problema balanceado: oferta y demanda coinciden.'
                  : 'Problema no balanceado: oferta y demanda son diferentes o están vacías.'}
            </div>

            
            {/* PREPARACIÓN DE DATOS */}
            <div className="acciones">
              <button
                type="button"
                className="boton-principal"
                disabled={!balanceado}
                onClick={() => setMostrarJSON(actual => !actual)}
              >
                {mostrarJSON ? 'Ocultar JSON' : 'Preparar datos'}
              </button>
            </div>

            {/* VISTA PREVIA DEL JSON */}
            {mostrarJSON && balanceado && (
              <div className="vista-json">
                <h3>Datos preparados para el backend</h3>

                <p>
                  Esta es la información que posteriormente
                  enviaremos al servidor.
                </p>

                <pre>
                  {JSON.stringify(datosParaEnviar, null, 2)}
                </pre>
              </div>
            )}



        </section>

        <div className="nota">
          <strong>Siguiente etapa:</strong> conectaremos
          el formulario con el backend para resolver el
          problema y mostrar las iteraciones.
        </div>
      </main>
    </div>
  )
}

export default App
