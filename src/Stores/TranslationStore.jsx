import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const TranslationStore = create(
    persist(
        (set) => ({
            language: 'en',
            changeLanguage: (newLanguage) => {
                set({ language: newLanguage });
            },
        }),
        {
            name: 'translation-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
        }
    )
);