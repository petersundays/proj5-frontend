import { useEffect, useRef } from "react";
import { UserStore } from "../Stores/UserStore";
import { StatisticsStore } from "../Stores/StatisticsStore";

const useWebSocketStatistics = () => {

    const user = UserStore((state) => state.user);
    const wsClientRef = useRef(null);
    const WS_URL = `ws://localhost:8080/backend_proj5_war_exploded/websocket/stats/${user.token}`;

    const sendMessage = () => {
        if (wsClientRef.current && wsClientRef.current.readyState === WebSocket.OPEN) {
            wsClientRef.current.send(JSON.stringify("ping"));
            
        } else {
            console.error("WebSocket is not open. Message not sent.");
        }
    };

    useEffect(() => {
        console.log("Connecting to statistics websocket");
        const ws = new WebSocket(WS_URL);    
    
        ws.onopen = () => {
            console.log("Connected to statistics websocket");
            StatisticsStore.getState().setWebSocket(ws);
        };

        ws.onmessage = (event) => {
            console.log("Received message from statistics websocket");
            const statistics = JSON.parse(event.data);
            StatisticsStore.setState(statistics);
        }

        ws.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        // Return a cleanup function that closes the WebSocket connection
        return () => {
            console.log("Closing websocket");
            ws.close();
        };
    }, []); 

    return { ws: wsClientRef.current, sendMessage };
}

export default useWebSocketStatistics;