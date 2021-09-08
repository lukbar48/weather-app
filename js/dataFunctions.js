export function getDayName(number) {
  let dayNumber = new Date()
  dayNumber = dayNumber.getDay() + number
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  if (dayNumber >= 7) {
    dayNumber = dayNumber % 7
  }
  return weekdays[dayNumber]
}