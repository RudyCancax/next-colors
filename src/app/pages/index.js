// pages/index.js
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-900">
      {/* Logo */}
      <div className="animate-bounce">
        <img src="/logo.png" alt="Logo del Juego" className="w-32 h-32 mb-8" />
      </div>

      {/* Título */}
      <h1 className="text-white text-5xl font-bold mb-10">Juego de Colores</h1>

      {/* Animación de Botellas */}
      <div className="flex space-x-4 mb-10">
        <img
          src="/bottles/green.svg"
          alt="Botella 1"
          className="w-16 h-32 animate-pulse"
        />
        <img
          src="/bottles/red.svg"
          alt="Botella 2"
          className="w-16 h-32 animate-pulse delay-200"
        />
        <img
          src="/bottles/yellow.svg"
          alt="Botella 3"
          className="w-16 h-32 animate-pulse delay-400"
        />
      </div>

      {/* Botón de Juego Nuevo */}
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105">
        Juego Nuevo
      </button>
    </div>
  );
}
