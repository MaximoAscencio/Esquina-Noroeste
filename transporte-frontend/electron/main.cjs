
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

console.log('1. Electron inició correctamente')

function crearVentana() {
  console.log('3. Intentando crear la ventana')

  const ventana = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    title: 'Método Esquina Noroeste',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  console.log('4. Ventana creada')

  ventana.webContents.on('did-finish-load', () => {
    console.log('5. Interfaz cargada correctamente')
  })

  ventana.webContents.on('did-fail-load', (
    event, codigo, descripcion
  ) => {
    console.error('ERROR AL CARGAR:', codigo, descripcion)
  })

  ventana.on('show', () => {
    console.log('Ventana visible')
  })

  ventana.loadFile(
    path.join(__dirname, '../dist/index.html')
  ).catch(error => {
    console.error('ERROR:', error)
  })
}

app.whenReady().then(() => {
  console.log('2. Electron está listo')
  crearVentana()
})

app.on('window-all-closed', () => {
  app.quit()
})
