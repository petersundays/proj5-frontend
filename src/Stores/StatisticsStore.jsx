import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const StatisticsStore = create(
  persist(
    (set, get) => ({
      userStats: new Array(9).fill(0),
      averageTaskTime: 0,
      categories: [],
      totalTasksDoneByEachDay: [[]],
      usersRegistered: [[]],
      ws: null,
      setStatistics: (statistics) =>
        set({
          userStats: statistics.userStats,
          averageTaskTime: statistics.averageTaskTime,
          categories: statistics.categories,
          totalTasksDoneByEachDay: statistics.totalTasksDoneByEachDay,
          usersRegistered: statistics.usersRegistered,
        }),
      setWebSocket: (ws) => set({ ws }),
      sendMessage: (message) => {
        const ws = get().ws;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        } else {
          console.error("WebSocket is not open. Message not sent.");
        }
      },
    }),

    {
      name: "statistics-storage",
      getStorage: () => createJSONStorage(() => sessionStorage),
    }
  )
);