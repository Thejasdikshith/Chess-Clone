import { useEffect } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);
      switch (message.type) {
        case INIT_GAME:
          console.log("Game initialized");
          break;
        case MOVE:
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
          <div className="col-span-4 bg-red-200 w-full">
            <ChessBoard />
          </div>
          <div className="col-span-2 bg-green-200 w-full">
            <button
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
