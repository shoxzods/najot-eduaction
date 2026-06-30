import { create } from 'zustand';

interface GroupsStore {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    refreshTrigger: number;
    triggerRefresh: () => void;
}

export const useGroupsStore = create<GroupsStore>((set) => ({
    isModalOpen: false,
    refreshTrigger: 0,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    triggerRefresh: () => set((s) => ({ refreshTrigger: s.refreshTrigger + 1 })),
}));