import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const TasksByUserStore = create(
    persist(
        (set) => ({
            user: {
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                phone: '',
                photoURL: '',
                typeOfUser: '',
                token: '',
            },
            updateUser: (updatedUser) => {
                set((state) => ({
                    user: {
                        ...state.user,
                        email: updatedUser.email || state.user.email,
                        firstName: updatedUser.firstName || state.user.firstName,
                        lastName: updatedUser.lastName || state.user.lastName,
                        phone: updatedUser.phone || state.user.phone,
                        photoURL: updatedUser.photoURL || state.user.photoURL,
                    },
                }));
            },
        }),
        {
            name: 'tasksByUser-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
            logout: (set) => () => set({ user: {} }),
        }
    )
);