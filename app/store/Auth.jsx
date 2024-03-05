import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    isAuth: false,
    walletInfo: { account: null, chainId: null },
    toggleAuth: () => set((state) => ({ isAuth: !state.isAuth })),
    setWalletInfo: (walletInfo) => {
        set({ walletInfo });
        if (walletInfo.account && walletInfo.chainId) {
            set({ isAuth: true });
        }
    },
}));