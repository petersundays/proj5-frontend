import React from "react";
import { NotificationStore } from "../Stores/NotificationStore";
import { useEffect } from "react";

export const WebSocketClient = () => {

    const addNotification = NotificationStore((state) => state.addNotification);
    const WS_URL = "ws://localhost:8080/backend_proj5_war_exploded/websocket/notifier/mytoken";

    useEffect(() => {

        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("Connected to websocket");
        };

        ws.onmessage = (event) => {
            const notification = event.data;
            console.log("Received notification: ", notification);
            addNotification(notification);
        };

        ws.onclose = () => {
            console.log("Disconnected from websocket");
        };

        return () => {
            ws.close();
        };

    }, []);

};

export default WebSocketClient;