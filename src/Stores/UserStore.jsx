import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const UserStore = create(
    persist(
        (set) => ({
            isAsideVisible: false,
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
            toggleAside: () => {
                set((state) => ({
                    isAsideVisible: !state.isAsideVisible,
                }));
            },
        }),
        {
            name: 'user-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
            logout: (set) => () => set({ user: {} }),
        }
    )
);