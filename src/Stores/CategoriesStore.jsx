import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const CategoriesStore = create(
    persist(
        (set) => ({
            categories: [],
            setCategories: (newCategories) => set({ categories: newCategories }),
        }),
        {
            name: 'categories-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
        }
    )
);
