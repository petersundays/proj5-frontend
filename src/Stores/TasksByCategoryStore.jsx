import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const TasksByCategoryStore = create(
    persist(
        (set) => ({
            tasks: [],
            addTask: (task) => {
                set((state) => ({
                    tasks: [...state.tasks, task],
                }));
            },
            removeTask: (taskId) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== taskId),
                }));
            },
            updateTask: (updatedTask) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        if (task.id === updatedTask.id) {
                            return updatedTask;
                        }
                        return task;
                    }),
                }));
            },
        }),
        {
            name: 'category-tasks-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
        }
    )
);