import { useEffect, useState } from "react";
import { Button } from "../components/Button.js";
import { ChessBoard } from "../components/ChessBoard.js";
import { useSocket } from "../hooks/useSocket.js";
import { Chess } from "chess.js";

//TODO
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GAME_STARTED = "game_started";
export const WAITING = "waiting";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setStarted(true);
          setBoard(chess.board());
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
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting to server...</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-5xl w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4  w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
            />
          </div>
          <div className="col-span-2 bg-slate-900 w-full flex justify-center">
            <div className="pt-8">
              {!started && (
                <Button
                  onClick={() =>
                    socket.send(
                      JSON.stringify({
                        type: INIT_GAME,
                      }),
                    )
                  }
                >
                  Play
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
