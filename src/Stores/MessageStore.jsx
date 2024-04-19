import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const MessageStore = create(
    persist(
        (set) => ({
            messages: [],
            addMessage: (message) => {
                set((state) => ({
                    messages: [...state.messages, message],
                }));
            },
            setMessages: (messages) => {
                set({ messages });
            },
        }),
        {
            name: 'messages-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
        }
    )
);