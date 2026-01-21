import { useEffect, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          console.log("Game initialized");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());

          console.log("Move received:", message.payload);
          break;
        case GAME_OVER:
          console.log("Game over:", message.payload);
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    };
  }, [socket]);
  if (!socket) return <div>Connecting to server...</div>;
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-3  w-full flex justify-center">
            <ChessBoard board={board} socket={socket} />
          </div>
          <div className="col-span-2 bg-green-500 w-full flex justify-center items-center mr-10">
            <button
              className="bg-green-800 rounded-2xl px-50 text-white py-10"
              onClick={() => {
                socket.send(JSON.stringify({ type: INIT_GAME }));
              }}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
