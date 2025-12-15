// AdvancedUsage.js - More complex examples
import DateTime from "./datetime.mjs";

// Creating dates
const today = DateTime.today();
const now = DateTime.now();
const specificDate = new DateTime("2024-03-15");
const fromTimestamp = DateTime.fromTimestamp(1647302400000);
const fromFormat = DateTime.fromFormat("15/03/2024", "DD/MM/YYYY");

// Date manipulation (immutable)
const tomorrow = today.add(1, "day");
const nextWeek = today.add(1, "week");
const nextMonth = today.add(1, "month");
const startOfMonth = today.startOf("month");
const endOfMonth = today.endOf("month");

// Date comparison
const isPast = specificDate.isBefore(today);
const isFuture = tomorrow.isAfter(today);
const isToday = today.isSame(now, "day");

// Formatting examples
console.log(today.format("YYYY-MM-DD")); // "2024-03-14"
console.log(today.format("dddd, MMMM D, YYYY")); // "Thursday, March 14, 2024"
console.log(today.format("h:mm A")); // "2:30 PM"

// Time differences
const daysBetween = today.diff(specificDate, "day");
const hoursUntilTomorrow = tomorrow.diff(today, "hour");

// Chaining operations
const result = DateTime.now()
  .startOf("day")
  .add(9, "hours") // 9:00 AM
  .add(30, "minutes") // 9:30 AM
  .format("HH:mm");

console.log(result); // "09:30"
