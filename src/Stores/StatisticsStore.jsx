import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const StatisticsStore = create(
  persist(
    (set) => ({
      userStats: new Array(9).fill(0),
      averageTaskTime: 0,
      categories: [],
      totalTasksDoneByEachDay: [[]],
      usersRegistered: [[]],
      setStatistics: (statistics) =>
        set({
          userStats: statistics.userStats,
          averageTaskTime: statistics.averageTaskTime,
          categories: statistics.categories,
          totalTasksDoneByEachDay: statistics.totalTasksDoneByEachDay,
          usersRegistered: statistics.usersRegistered,
        }),
    }),

    {
      name: "statistics-storage",
      getStorage: () => createJSONStorage(() => sessionStorage),
    }
  )
);
