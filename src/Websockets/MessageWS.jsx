import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { UserStore } from "../Stores/UserStore";
import { MessageStore } from "../Stores/MessageStore";

const useWebSocketMessage = (receiver) => {
    const user = UserStore((state) => state.user);
    const addMessage = MessageStore((state) => state.addMessage);
    const wsClientRef = useRef(null);
    const location = useLocation();
    const WS_URL = `ws://localhost:8080/backend_proj5_war_exploded/websocket/messages/${user.token}/${receiver}`;

    useEffect(() => {
        if (receiver === user.username) {
            const ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log("Connected to websocket");
                wsClientRef.current = ws;
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Received message: ", message);
                addMessage(message);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error: ", error);
            };

            ws.onclose = (event) => {
                console.log("Disconnected from websocket");
                wsClientRef.current = null;
            };

            return () => {
                if (wsClientRef.current) {
                    wsClientRef.current.close(1000, "WebSocket cleanup");
                    wsClientRef.current = null;
                }
            };
        } else {
            // Receiver does not match logged-in user, close WebSocket if it's open
            if (wsClientRef.current) {
                wsClientRef.current.close(1000, "WebSocket cleanup");
                wsClientRef.current = null;
            }
        }
    }, [receiver, user.username, location.pathname]);

    return wsClientRef.current;
};

export default useWebSocketMessage;
