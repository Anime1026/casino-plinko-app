import { produce } from 'immer'
import toast from 'react-hot-toast'
import create from 'zustand'

interface User {
  id: string
  name: string
}

interface Wallet {
  balance: number
}

interface State {
  user: User
  wallet: Wallet
  setUser: (user: User) => void
  isWalletLoading: boolean
  setBalance: (balance: number) => void
}

const userInitialState: User = {
  id: '',
  name: '',
}

const walletInitialState: Wallet = {
  balance: 0
}

export const useAuthStore = create<State>((setState: any, getState: any) => ({
  user: userInitialState,
  wallet: walletInitialState,
  isWalletLoading: false,
  setBalance: (balance: number) => {
    console.log('setBalance = ', balance)
    try {
      setState(
        produce<State>(state => {
          state.wallet.balance = balance
          state.isWalletLoading = false
        })
      )
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('setBalanceError', error)
    }
  },
  setUser: (user: User) => {
    try {
      setState(
        produce<State>(state => {
          state.user = user
        })
      )
    } catch (error) {
      toast.error('An error occurred while updating user data')
      console.error('setUserError', error)
    }
  }
}))
