import { format, getTime } from 'date-fns'

export const getTimestamp = (date: string | number | Date) => {
  return getTime(new Date(date))
}

export const getYearMonthDate = (timestamp: number) => {
  return format(new Date(timestamp), 'yyyy-MM-dd')
}
