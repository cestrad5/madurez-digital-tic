<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/n8n-FF6E61?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n" />
</div>

<h1 align="center">🚀 Madurez Digital TIC - Plataforma de Evaluación</h1>

<p align="center">
  <strong>Herramienta interactiva, corporativa y escalable para medir el nivel de madurez digital de las empresas del sector TIC.</strong>
</p>

---

## 📖 Sobre el Proyecto

La **Plataforma de Madurez Digital TIC** es una solución de evaluación (*Assessment Tool*) diseñada para diagnosticar el estado de transformación digital de las empresas en base a 5 dimensiones críticas. Va más allá de un simple formulario: ofrece una experiencia de usuario (UX) premium segmentada por sector y tamaño de la empresa, provee benchmarks comparativos regionales, un tablero de análisis (Dashboard) y emite rutas de transformación de 90 días adaptadas al resultado de cada organización.

## ✨ Características Principales

*   🎯 **UX/UI Premium & Glassmorphism:** Interfaz cuidada al detalle, modo de navegación intuitivo (teclado habilitado) y componentes segmentados que recompensan visualmente el avance del usuario.
*   📊 **Dashboard de Benchmarking:** Visualización de promedios de la industria según *Tamaño* y *Sub-sector* utilizando **Recharts**.
*   🌎 **Segmentación Geográfica Integrada:** Captura inteligente de ubicación (Región → País → Departamento/Estado) adaptada para toda América Latina y el Caribe.
*   🔒 **Autenticación Segura & Base de Datos:** Integración nativa con Firebase Authentication (Google/Email) y Firestore para resguardo histórico de los diagnósticos.
*   ⚡ **Automatización & Webhooks (n8n):** Emisión automática de metadatos (en formato JSON fire-and-forget) hacia *n8n* para la orquestación de correos electrónicos, CRM u otras integraciones corporativas.
*   📄 **Generación de Reportes PDF:** Funcionalidad nativa y estilizada de impresión limpia (`window.print()`) para la exportación de resultados y hojas de ruta.

## 🛠️ Stack Tecnológico

El proyecto sigue una arquitectura **Frontend moderno en la nube**, impulsado por Vite:

*   **Core:** React 18 + Vite (Extremadamente rápido).
*   **Routing:** React Router v6.
*   **Estilos:** Vanilla CSS moderno (Variables CSS, Animaciones, Flex/Grid). Sin ataduras a frameworks complejos.
*   **Iconografía:** Lucide React (Ligero y escalable).
*   **Visualización de Datos:** Recharts.
*   **BaaS (Backend as a Service):** Firebase (Auth + Firestore).
*   **Automatización:** n8n (Webhooks).

## 📂 Estructura del Proyecto

```text
src/
├── components/          # Componentes reutilizables (Botones, Modales, Layout)
│   └── layout/          # Elementos globales (Header, Footer)
├── lib/                 # Lógica de negocio y bases de datos estáticas
│   ├── benchmark.js     # Motor y mock data del Benchmark
│   ├── locationData.js  # Regiones, países y estados de LATAM
│   ├── questions.js     # Las 5 dimensiones y sus preguntas
│   ├── scoring.js       # Algoritmo de cálculo de resultados
│   └── firebase.js      # Configuración de Firebase
├── pages/               # Vistas principales de la aplicación
│   ├── Landing.jsx      # Página de aterrizaje
│   ├── Assessment.jsx   # Formulario inteligente de diagnóstico
│   ├── Results.jsx      # Pantalla de puntajes
│   ├── Roadmap.jsx      # Plan de acción 90-días
│   ├── Dashboard.jsx    # Tablero estadístico regional
│   ├── History.jsx      # Diagnósticos pasados
│   └── Profile.jsx      # Gestión de usuario
├── styles/              # Sistema de diseño global y resets
└── App.jsx              # Enrutador principal
```

## 🚀 Instalación y Despliegue Local

1. **Clonar el repositorio:**
   ```bash
   git clone git@github.com:cestrad5/madurez-digital-tic.git
   cd madurez-digital-tic/app
   ```

2. **Instalar dependencias:**
   Asegúrate de contar con Node.js (v20+ recomendado).
   ```bash
   npm install
   ```

3. **Variables de Entorno (Firebase):**
   Crea un archivo `.env` en la raíz de `app/` basándote en la configuración de Firebase de tu entorno:
   ```env
   VITE_FIREBASE_API_KEY="tu_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="tu_proyecto.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="tu_proyecto"
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

5. **Construcción para Producción:**
   ```bash
   npm run build
   ```
   Los archivos listos para producción se generarán en la carpeta `dist/`.

## 📈 Despliegue (CI/CD)

Este proyecto está integrado con **GitHub Actions**. La carpeta `dist/` se ignora en el repositorio, ya que cualquier push a la rama `main` lanza el flujo de trabajo (`.github/workflows`) que compila la aplicación y la despliega automáticamente en el entorno de producción.

## 👥 Contribución

Si eres un colaborador interno, recuerda:
1. Crea una rama para tu feature: `git checkout -b feature/nueva-mejora`
2. Realiza un push y abre un *Pull Request* hacia la rama `main`.
3. Evita commitear información sensible (revisa siempre tu `.env`).

---
<p align="center">
  Hecho con 💡 para la transformación digital empresarial.
</p>
