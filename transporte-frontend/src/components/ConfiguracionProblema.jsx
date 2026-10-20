
function ConfiguracionProblema({
  numeroOrigenes,
  numeroDestinos,
  cambiarOrigenes,
  cambiarDestinos
}) {
  const opciones = Array.from(
    { length: 10 },
    (_, i) => i + 1
  )

  return (
    <div className="configuracion">

      <label className="campo">
        <span>Número de orígenes</span>

        <select
          value={numeroOrigenes}
          onChange={(e) =>
            cambiarOrigenes(e.target.value)
          }
        >
          {opciones.map(numero => (
            <option key={numero} value={numero}>
              {numero}
            </option>
          ))}
        </select>
      </label>

      <label className="campo">
        <span>Número de destinos</span>

        <select
          value={numeroDestinos}
          onChange={(e) =>
            cambiarDestinos(e.target.value)
          }
        >
          {opciones.map(numero => (
            <option key={numero} value={numero}>
              {numero}
            </option>
          ))}
        </select>
      </label>

    </div>
  )
}

export default ConfiguracionProblema
