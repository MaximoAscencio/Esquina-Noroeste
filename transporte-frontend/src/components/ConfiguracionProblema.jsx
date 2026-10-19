
function ConfiguracionProblema({
  numeroOrigenes,
  numeroDestinos,
  cambiarOrigenes,
  cambiarDestinos
}) {
  return (
    <div className="configuracion">

      <label className="campo">
        <span>Número de orígenes</span>

        <select
          value={numeroOrigenes}
          onChange={(e) => cambiarOrigenes(e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6].map((numero) => (
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
          onChange={(e) => cambiarDestinos(e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6].map((numero) => (
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
