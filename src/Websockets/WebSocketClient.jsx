import { useEffect, useRef } from "react";
import { NotificationStore } from "../Stores/NotificationStore";
import { UserStore } from "../Stores/UserStore";

export const useWebSocketClient = () => {
    const addNotification = NotificationStore((state) => state.addNotification);
    const wsClientRef = useRef(null); // Store the WebSocket client object in a ref and prevents re-renders 
    const user = UserStore((state) => state.user);
    const WS_URL = `ws://localhost:8080/backend_proj5_war_exploded/websocket/notifier/${user.token}`;

    useEffect(() => {
        const connect = () => {
            if (wsClientRef.current && wsClientRef.current.readyState === WebSocket.OPEN) {
                console.log("WebSocket is already connected");
                return;
            }
            
            NotificationStore.setState({ notifications: [] }); // Clear any existing notifications
            const ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log("Connected to websocket");
                wsClientRef.current = ws; 
                NotificationStore.setState({ WebSocketClient: true });
            };

            ws.onmessage = (event) => {
                const notification = JSON.parse(event.data);
                addNotification(notification);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error: ", error);
            };

            ws.onclose = (event) => {
                console.log("Disconnected from websocket");
                wsClientRef.current = null;
                NotificationStore.setState({ WebSocketClient: false });
                NotificationStore.setState({ notifications: [] });  
                // If the WebSocket was closed for a reason other than the user logging out, try to reconnect
                if (!event.wasClean && user && user.token) {
                    console.log("Reconnecting to websocket...");
                    setTimeout(connect, 5000);  // Try to reconnect after a delay
                }
            };
        };

        if (user.token) {
            connect();
        }

        return () => {
            if (wsClientRef.current) {
                wsClientRef.current.close(1000, "User logged out");  // Close the WebSocket connection when the user logs out
                wsClientRef.current = null;
            }
        };
    }, [user.token]);  // Depend on the user's login status

    return wsClientRef.current;
};