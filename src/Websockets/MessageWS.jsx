import { useEffect, useRef } from "react";
import { UserStore } from "../Stores/UserStore";
import { MessageStore } from "../Stores/MessageStore";

const useWebSocketMessage = (receiver) => {
    const user = UserStore((state) => state.user);
    const addMessage = MessageStore((state) => state.addMessage);
    const wsClientRef = useRef(null);
    const WS_URL = `ws://localhost:8080/backend_proj5_war_exploded/websocket/messages/${user.token}/${receiver}`;

    const sendMessage = (message) => {
        if (wsClientRef.current && wsClientRef.current.readyState === WebSocket.OPEN) {
            wsClientRef.current.send(JSON.stringify(message));
            
        } else {
            console.error("WebSocket is not open. Message not sent.");
        }
    };

    useEffect(() => {
        if (receiver !== user.username) {
            const ws = new WebSocket(WS_URL);    
            ws.onopen = () => {
                console.log("Connected to websocket");
                wsClientRef.current = ws;
            };
    
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                addMessage(message);
            };
    
            ws.onerror = (error) => {
                console.error("WebSocket error: ", error);
            };
    
            // Return a cleanup function that closes the WebSocket connection
            return () => {
                console.log("Closing websocket");
                ws.close();
            };
        }
    }, [receiver]); 

    return { ws: wsClientRef.current, sendMessage };
};

export default useWebSocketMessage;
