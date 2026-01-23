import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { MOVE, GAME_OVER, INIT_GAME } from "./messages.js";

export class Game {
  public player1: WebSocket; // white
  public player2: WebSocket; // black
  public board: Chess;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();

    // Notify players of game start + color
    this.player1.send(
      JSON.stringify({
        type: "game_started",
        payload: { color: "white" },
      }),
    );

    this.player2.send(
      JSON.stringify({
        type: "game_started",
        payload: { color: "black" },
      }),
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // 1️⃣ Validate turn using chess.js
    const turn = this.board.turn(); // 'w' or 'b'

    if (turn === "w" && socket !== this.player1) return;
    if (turn === "b" && socket !== this.player2) return;

    // 2️⃣ Attempt move
    let result;
    try {
      result = this.board.move(move);
    } catch {
      return;
    }

    if (!result) return; // illegal move

    // 3️⃣ Check game over
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white";

      const message = JSON.stringify({
        type: GAME_OVER,
        payload: { winner },
      });

      // Send to BOTH players
      this.player1.send(message);
      this.player2.send(message);
      return;
    }

    // 4️⃣ Send move to the opponent
    if (socket === this.player1) {
      // white moved → notify black
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    } else {
      // black moved → notify white
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    }
  }
}
