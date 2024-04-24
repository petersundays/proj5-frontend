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
                    if (message.actionToDo === 'update') {
                        AllTasksStore.getState().updateTask(message.task); 
                    } else if (message.actionToDo === 'add') {
                        const newTasks = [...AllTasksStore.getState().tasks, message.task];
                        AllTasksStore.setState({ tasks: newTasks });
                    }

                } else if (typeof message.actionToDo === 'string' && typeof message.id === 'string') {
                    AllTasksStore.getState().removeTask(message.id);
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