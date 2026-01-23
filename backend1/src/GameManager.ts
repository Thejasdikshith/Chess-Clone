import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private socketToGame: Map<WebSocket, Game>;

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.socketToGame = new Map();
  }

  addUser(socket: WebSocket) {
    this.addHandler(socket);

    socket.on("close", () => {
      this.removeUser(socket);
    });
  }

  removeUser(socket: WebSocket) {
    // If user was waiting, clear pending
    if (this.pendingUser === socket) {
      this.pendingUser = null;
    }

    // If user was in a game, clean it up
    const game = this.socketToGame.get(socket);
    if (game) {
      this.socketToGame.delete(game.player1);
      this.socketToGame.delete(game.player2);

      this.games = this.games.filter((g) => g !== game);
    }
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      // INIT GAME
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);

          // Map both players to the game (CRITICAL FIX)
          this.socketToGame.set(this.pendingUser, game);
          this.socketToGame.set(socket, game);

          this.pendingUser = null;
        } else {
          this.pendingUser = socket;

          socket.send(
            JSON.stringify({
              type: "waiting_for_opponent",
            }),
          );
        }
        return;
      }

      // MOVE
      if (message.type === MOVE) {
        const game = this.socketToGame.get(socket);
        if (game) {
          game.makeMove(socket, message.payload.move);
        }
      }
    });
  }
}
