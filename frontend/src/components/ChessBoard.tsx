import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";
import { useSocket } from "../hooks/useSocket";
export const ChessBoard = ({
  board,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [to, setTo] = useState<null | Square>(null);
  const socket = useSocket();

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(square?.square ?? null);
                    } else {
                      setTo(square?.square ?? null);
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            from,
                            to,
                          },
                        }),
                      );
                    }
                  }}
                  key={j}
                  className={`w-16 h-16 ${(i + j) % 2 ? "bg-green-500" : "bg-white"}`}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col bg">
                      {square ? square.type : ""}
                    </div>
                  </div>

                  {square ? square.type : ""}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
