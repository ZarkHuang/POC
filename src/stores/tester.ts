import { defineStore } from 'pinia'
import { mockData } from '@/utils/config/mock-data'

export const useTesterStore = defineStore('tester', () => {
  const testerList = ref<Array<TesterType>>(mockData.testerList)

  function setTesterList(list: Array<TesterType>) {
    testerList.value = list
  }

  return {
    testerList,
    setTesterList,
  }
})
