import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const AllUsersStore = create(
    persist(
        (set) => ({
            users: [],
            displayContainer: false,
            newUser: false,
            selectedUser: '',
            userType: '',
            userToEdit: {},
            addUser: (user) => {
                set((state) => ({
                    users: [...state.users, user],
                }));
            },
            removeUser: (username) => {
                set((state) => ({
                    users: state.users.filter((user) => user.username !== username),
                }));
            },
            updateUser: (updatedUser) => {
                set((state) => ({
                    users: state.users.map((user) => {
                        if (user.username === updatedUser.username) {
                            return updatedUser;
                        }
                        return user;
                    }),
                }));
            },
            setDisplayContainer: (value) => { 
                set({ displayContainer: value });
            },
            setNewUser: (value) => { 
                set({ newUser: value });
            },
            setSelectedUser: (value) => {
                set({ selectedUser: value });
            },
            setUserType: (value) => {
                set({ userType: value });
            },
            setUserToEdit: (value) => {
                set((state) => ({
                    ...state,
                    userToEdit: value
                }));
            },
        }),
        {
            name: 'users-storage',
            getStorage: () => createJSONStorage(() => sessionStorage),
        }
    )
);