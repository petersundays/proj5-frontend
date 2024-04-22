import { create } from 'zustand';

export const StatisticsStore = create(set => ({
  userStats: new Array(9).fill(0),
  averageTaskTime: 0,
  categories: [],
  totalTasksDoneByEachDay: [[]],
  usersRegistered: [[]],
  setStatistics: (statistics) => set({
    userStats: statistics.userStats,
    averageTaskTime: statistics.averageTaskTime,
    categories: statistics.categories,
    totalTasksDoneByEachDay: statistics.totalTasksDoneByEachDay,
    usersRegistered: statistics.usersRegistred,
  }),
}));