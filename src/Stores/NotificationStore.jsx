import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const NotificationStore = create(
    persist(
        (set) => ({
            notifications: [],
            addNotification: (notification) => {
                set((state) => ({
                    notifications: [...state.notifications, notification],
                }));
            },
            removeNotification: (notificationId) => {
                set((state) => ({
                    notifications: state.notifications.filter((notification) => notification.id !== notificationId),
                }));
            },
        }),
        {
            name: 'notifications-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
        }
    )
); 
