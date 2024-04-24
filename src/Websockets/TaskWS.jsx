import { useEffect, useRef } from "react";
import { UserStore } from "../Stores/UserStore";
import { AllTasksStore } from "../Stores/AllTasksStore";

const useWebSocketTask = () => {
    const user = UserStore((state) => state.user);
    const wsClientRef = useRef(null);
    const WS_URL = `ws://localhost:8080/backend_proj5_war_exploded/websocket/messages/${user.token}`;

    useEffect(() => {
        if (user) {
            const ws = new WebSocket(WS_URL);    
            ws.onopen = () => {
                console.log("Connected to websocket");
                wsClientRef.current = ws;
            };
        
            ws.onmessage = (event) => {
                console.log(event.data);
                const message = JSON.parse(event.data);

                if (typeof message.task === 'object' && message.task !== null) {
console.log("Received a MESSAGE: ", message);
                    if (message.actionToDo === 'update') {
                        AllTasksStore.getState().updateTask(message.task); 
                    }

                } else if (typeof message.id === 'string') {
                    // The message contains an id string
                    console.log("*******Received an id: ", message.id);
                }
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
    }, [user]); 

    return { ws: wsClientRef.current };
};

export default useWebSocketTask;