import { TesterType } from "@/global"

export const mockData: {
  testerList: TesterType[]
} = {
  testerList: [
    {
      id: '1',
      pname: '紫米飯糰',
      units: '1杯',
      grams: 200,
      cook: '蒸或煮',
      kcal: 500,
    },
    {
      id: '2',
      pname: '烤雞胸肉',
      units: '2片',
      grams: 100,
      cook: '烤',
      kcal: 165,
    },
    {
      id: '3',
      pname: '水煮蛋',
      units: '半顆',
      grams: 25,
      cook: '水煮',
      kcal: 40,
    },
  ],
}
