import { use, useEffect, useState } from "react";
export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const WS_URL = "ws://localhost:8000";

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };
    return () => {
        console.log("disconnecting websocket");
      ws.close();
    };
  }, []);

  return socket;
};
