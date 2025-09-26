# 🚦 Sistema de Control de Tráfico - Popayán y alrededores

Este proyecto es una aplicación web desarrollada en **React** que muestra en tiempo real el estado del tráfico en Popayán y sus alrededores.  
Incluye indicadores de congestión vial, incidentes (accidentes, obras, bloqueos) y soporta la integración con **Google Maps API**.

---

## 📌 Requisitos Previos

Antes de empezar asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada: 18 o superior)  
- [npm](https://www.npmjs.com/) (viene con Node.js)  
- Una cuenta en [Google Cloud](https://console.cloud.google.com/) para generar una API Key

---

## ⚙️ Instalación

1. **Clona este repositorio**
   ```bash
   git clone https://github.com/usuario/nombre-del-repo.git
   cd nombre-del-repo


## ⚙️ Instalación

1. **Clona este repositorio**
   ```bash
   git clone https://github.com/usuario/nombre-del-repo.git
   cd nombre-del-repo
Instala las dependencias

npm install
Configura tu API Key de Google

En la raíz del proyecto crea un archivo .env.local

Agrega la siguiente variable (reemplaza con tu API Key de Google Cloud):

REACT_APP_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
⚠️ Nota: La API Key no debe subirse al repositorio por seguridad. El archivo .env.local está en .gitignore.

Ejecuta el servidor de desarrollo

npm run dev
Luego abre en el navegador:

👉 http://localhost:3000

📂 Scripts disponibles
En el proyecto puedes ejecutar:

npm run dev → Inicia el servidor de desarrollo

npm run build → Genera la versión optimizada para producción

npm start → Inicia el servidor en modo producción

🗺️ APIs utilizadas
Este proyecto utiliza:

Google Maps JavaScript API (para mostrar el mapa)

Google Places / Traffic Layer API (para capas de tráfico e incidentes)

Recuerda habilitar estas APIs en Google Cloud Console.


📜 Licencia
Este proyecto es de uso académico y colaborativo.
