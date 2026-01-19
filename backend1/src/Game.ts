import { Chess } from "chess.js";
import type WebSocket from "ws";
import { INIT_GAME, MOVE, GAME_OVER } from "./messages.js";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private moveCount = 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { color: "white" },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { color: "black" },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // Turn validation
    if (this.moveCount % 2 === 0 && socket !== this.player1) return;
    if (this.moveCount % 2 === 1 && socket !== this.player2) return;

    try {
      this.board.move(move);
    } catch {
      return;
    }

    // Game over
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white";

      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { winner },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { winner },
        })
      );
      return;
    }

    // Send move to opponent
    if (this.moveCount % 2 === 0) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }

    this.moveCount++;
  }
}
