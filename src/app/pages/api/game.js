// Archivo: pages/api/game.js
import { Board, Servo } from "johnny-five";

let board = null;
let servo = null;

if (!board) {
  board = new Board();
  board.on("ready", () => {
    console.log("Arduino conectado");
    servo = new Servo(10); // Pin 10 del Arduino para el servomotor
    servo.to(0); // Posición inicial del servomotor
  });
}

export default function handler(req, res) {
  const { action } = req.query;

  if (action === "start") {
    // Mueve el servo o inicia alguna otra acción con el hardware
    if (servo) {
      servo.to(100); // Mover el servomotor
      res.status(200).json({ message: "Juego iniciado, servomotor movido" });
    } else {
      res.status(500).json({ message: "El servomotor no está listo" });
    }
  } else if (action === "reset") {
    if (servo) {
      servo.to(0); // Resetear el servomotor
      res
        .status(200)
        .json({ message: "Juego reseteado, servomotor a posición inicial" });
    } else {
      res.status(500).json({ message: "El servomotor no está listo" });
    }
  } else {
    res.status(400).json({ message: "Acción no válida" });
  }
}
