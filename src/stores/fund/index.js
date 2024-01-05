import { defineStore } from 'pinia'
import { getAllFundsApi, getSaveFundsApi } from '../../api/system/fund'

export const useFundStore = defineStore('fund-store', {
  persist: true,
  state: () => ({
    allFunds: [],
    saveFunds: [],
    loading: false
  }),
  getters: {
    filterFunds: (state) => {}
  },
  actions: {
    async getAllFunds() {
      const funds = localStorage.getItem('funds')
      if (funds) {
        this.allFunds = JSON.parse(funds || [])
        return
      }
      try {
        const { code, message, data } = await getAllFundsApi()
        if (code === 200) {
          this.allFunds = data
          this.toSaveFunds()
        } else {
          $message.error(message || 'getAllFundsApi failed')
        }
      } catch {
        $message.error('getAllFundsApi failed')
      } finally {
      }
    },
    async getSaveFunds() {
      this.loading = true
      try {
        const { code, message, data } = await getSaveFundsApi()
        console.log(data)
        if (code === 200) {
          this.saveFunds = data
          this.toSaveFunds()
        } else {
          $message.error(message || 'getAllFundsApi failed')
        }
      } catch {
        $message.error('getAllFundsApi failed')
      } finally {
        this.loading = false
      }
    },
    toSaveFunds() {
      localStorage.setItem('funds', JSON.stringify(this.allFunds))
    }
  }
})
