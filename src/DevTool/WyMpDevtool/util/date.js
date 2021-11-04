export function getTime () {
  const fix = num => {
    return num < 10 ? '0' + num : num
  }
  const date = new Date()
  const time = `${fix(date.getHours())}:${fix(date.getMinutes())}:${fix(
    date.getSeconds()
  )}`
  return time
}
