import { useEffect, useRef } from "react";
import { UserStore } from "../Stores/UserStore";

const useWebSocketTask = () => {
    const user = UserStore((state) => state.user);
    const wsClientRef = useRef(null);
    const WS_URL = `ws://localhost:8080/backend_proj5_war_exploded/websocket/messages/${user.token}`;

    
    useEffect(() => {
        
        const ws = new WebSocket(WS_URL);    
        ws.onopen = () => {
            console.log("Connected to websocket");
            wsClientRef.current = ws;
        };
    
        ws.onmessage = (event) => {
            console.log(event.data);
        };
    
        ws.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };
    
        // Return a cleanup function that closes the WebSocket connection
        return () => {
            console.log("Closing websocket");
            ws.close();
        };
        
    }, []); 

    return { ws: wsClientRef.current };
};

export default useWebSocketTask;
