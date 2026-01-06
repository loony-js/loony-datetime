// DateTime.js - A comprehensive date/time manipulation library
// No dependencies, fully self-contained

/**
 * DateTime - A modern date/time manipulation class
 *
 * Features:
 * - Immutable operations (all methods return new instances)
 * - Chainable API
 * - Intuitive parsing and formatting
 * - Timezone support (basic)
 * - Date arithmetic and comparison
 * - Localization support
 */
class DateTime {
  /**
   * Create a DateTime instance
   * @param {Date|string|number|DateTime} date - Input date
   */
  constructor(date = new Date()) {
    if (date instanceof DateTime) {
      this._date = new Date(date._date.getTime());
    } else if (date instanceof Date) {
      this._date = new Date(date.getTime());
    } else if (typeof date === "string") {
      this._date = DateTime.parse(date);
    } else if (typeof date === "number") {
      this._date = new Date(date);
    } else {
      this._date = new Date();
    }
  }

  // ============== STATIC METHODS ==============

  /**
   * Create a DateTime from various formats
   */
  static now() {
    return new DateTime();
  }

  static today() {
    const now = new Date();
    return new DateTime(
      new Date(now.getFullYear(), now.getMonth(), now.getDate())
    );
  }

  static fromISO(string) {
    const date = new Date(string);
    return new DateTime(date);
  }

  static fromTimestamp(timestamp) {
    return new DateTime(new Date(timestamp));
  }

  static fromFormat(string, format) {
    // Simple format parsing (for demo purposes)
    // In a full implementation, this would be more robust
    if (format === "YYYY-MM-DD") {
      const [year, month, day] = string.split("-").map(Number);
      return new DateTime(new Date(year, month - 1, day));
    }
    if (format === "DD/MM/YYYY") {
      const [day, month, year] = string.split("/").map(Number);
      return new DateTime(new Date(year, month - 1, day));
    }
    if (format === "MM/DD/YYYY") {
      const [month, day, year] = string.split("/").map(Number);
      return new DateTime(new Date(year, month - 1, day));
    }
    return new DateTime(string);
  }

  static parse(string) {
    // Try multiple parsing strategies
    const parsed = new Date(string);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    // Try common formats
    const formats = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"];

    for (const format of formats) {
      try {
        const dt = DateTime.fromFormat(string, format);
        if (dt.isValid()) {
          return dt._date;
        }
      } catch (e) {
        // Continue to next format
      }
    }

    return new Date();
  }

  static isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // ============== ADDITIONAL STATIC METHODS ==============

  /**
   * Get the minimum date from an array of dates/DateTimes
   * @param {...(DateTime|Date|string)} dates - Dates to compare
   * @returns {DateTime} The earliest date
   */
  static min(...dates) {
    if (dates.length === 0) return DateTime.now();

    const dateTimes = dates.map((d) => new DateTime(d));
    const timestamps = dateTimes.map((dt) => dt.timestamp);
    const minTimestamp = Math.min(...timestamps);

    return dateTimes.find((dt) => dt.timestamp === minTimestamp);
  }

  /**
   * Get the maximum date from an array of dates/DateTimes
   * @param {...(DateTime|Date|string)} dates - Dates to compare
   * @returns {DateTime} The latest date
   */
  static max(...dates) {
    if (dates.length === 0) return DateTime.now();

    const dateTimes = dates.map((d) => new DateTime(d));
    const timestamps = dateTimes.map((dt) => dt.timestamp);
    const maxTimestamp = Math.max(...timestamps);

    return dateTimes.find((dt) => dt.timestamp === maxTimestamp);
  }

  /**
   * Check if a string or date is valid
   * @param {string|Date|DateTime} date - Date to validate
   * @returns {boolean} True if valid
   */
  static isValidDate(date) {
    try {
      const dt = new DateTime(date);
      return dt.isValid();
    } catch {
      return false;
    }
  }

  /**
   * Get the number of days between two dates
   * @param {DateTime|Date|string} date1 - First date
   * @param {DateTime|Date|string} date2 - Second date
   * @returns {number} Days between (always positive)
   */
  static daysBetween(date1, date2) {
    const dt1 = new DateTime(date1);
    const dt2 = new DateTime(date2);
    return Math.abs(dt1.diff(dt2, "day"));
  }

  /**
   * Create DateTime from object
   * @param {Object} obj - Date parts
   * @param {number} obj.year - Year
   * @param {number} obj.month - Month (1-12)
   * @param {number} obj.day - Day (1-31)
   * @param {number} [obj.hour=0] - Hour (0-23)
   * @param {number} [obj.minute=0] - Minute (0-59)
   * @param {number} [obj.second=0] - Second (0-59)
   * @param {number} [obj.millisecond=0] - Millisecond (0-999)
   * @returns {DateTime} New DateTime instance
   */
  static fromObject({
    year,
    month,
    day,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
  }) {
    return new DateTime(
      new Date(year, month - 1, day, hour, minute, second, millisecond)
    );
  }

  /**
   * Create DateTime from array [year, month, day, hour, minute, second, millisecond]
   * @param {number[]} array - Date parts
   * @returns {DateTime} New DateTime instance
   */
  static fromArray([
    year,
    month,
    day,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
  ]) {
    return new DateTime(
      new Date(year, month - 1, day, hour, minute, second, millisecond)
    );
  }

  // ============== ADDITIONAL INSTANCE METHODS ==============

  /**
   * Set specific date parts (returns new instance)
   * @param {Object} values - Values to set
   * @returns {DateTime} New DateTime instance
   */
  set(values) {
    const newDate = new Date(this.timestamp);

    if (values.year !== undefined) newDate.setFullYear(values.year);
    if (values.month !== undefined) newDate.setMonth(values.month - 1);
    if (values.day !== undefined) newDate.setDate(values.day);
    if (values.hour !== undefined) newDate.setHours(values.hour);
    if (values.minute !== undefined) newDate.setMinutes(values.minute);
    if (values.second !== undefined) newDate.setSeconds(values.second);
    if (values.millisecond !== undefined)
      newDate.setMilliseconds(values.millisecond);

    return new DateTime(newDate);
  }

  /**
   * Get the week number of the year (ISO 8601)
   * @returns {number} Week number (1-53)
   */
  get weekNumber() {
    const date = new Date(this.timestamp);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

    const week1 = new Date(date.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }

  /**
   * Get the quarter (1-4)
   * @returns {number} Quarter number
   */
  get quarter() {
    return Math.floor(this.month / 3) + 1;
  }

  /**
   * Get the day of the year (1-366)
   * @returns {number} Day of year
   */
  get dayOfYear() {
    const start = new Date(this.year, 0, 0);
    const diff = this._date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * Check if it's a weekend
   * @returns {boolean} True if Saturday or Sunday
   */
  isWeekend() {
    return this.dayOfWeek === 0 || this.dayOfWeek === 6;
  }

  /**
   * Check if it's a weekday
   * @returns {boolean} True if Monday through Friday
   */
  isWeekday() {
    return !this.isWeekend();
  }

  /**
   * Check if the date is today
   * @returns {boolean} True if date is today
   */
  isToday() {
    const today = DateTime.today();
    return this.isSame(today, "day");
  }

  /**
   * Check if the date is yesterday
   * @returns {boolean} True if date is yesterday
   */
  isYesterday() {
    const yesterday = DateTime.today().subtract(1, "day");
    return this.isSame(yesterday, "day");
  }

  /**
   * Check if the date is tomorrow
   * @returns {boolean} True if date is tomorrow
   */
  isTomorrow() {
    const tomorrow = DateTime.today().add(1, "day");
    return this.isSame(tomorrow, "day");
  }

  /**
   * Get the next occurrence of a specific day of week
   * @param {number|string} day - Day of week (0-6 or name)
   * @returns {DateTime} Next occurrence
   */
  next(day) {
    let targetDay;

    if (typeof day === "string") {
      const index = DateTime.dayNamesShort.findIndex(
        (d) => d.toLowerCase() === day.toLowerCase().slice(0, 3)
      );
      targetDay = index !== -1 ? index : 0;
    } else {
      targetDay = Math.max(0, Math.min(6, day));
    }

    const daysAhead = (targetDay + 7 - this.dayOfWeek) % 7;
    const addDays = daysAhead === 0 ? 7 : daysAhead;

    return this.add(addDays, "day").startOf("day");
  }

  /**
   * Get the previous occurrence of a specific day of week
   * @param {number|string} day - Day of week (0-6 or name)
   * @returns {DateTime} Previous occurrence
   */
  previous(day) {
    let targetDay;

    if (typeof day === "string") {
      const index = DateTime.dayNamesShort.findIndex(
        (d) => d.toLowerCase() === day.toLowerCase().slice(0, 3)
      );
      targetDay = index !== -1 ? index : 0;
    } else {
      targetDay = Math.max(0, Math.min(6, day));
    }

    const daysBefore = (this.dayOfWeek + 7 - targetDay) % 7;
    const subtractDays = daysBefore === 0 ? 7 : daysBefore;

    return this.subtract(subtractDays, "day").startOf("day");
  }

  /**
   * Check if this date is in daylight saving time
   * @returns {boolean} True if in DST
   */
  isDST() {
    const jan = new Date(this.year, 0, 1);
    const jul = new Date(this.year, 6, 1);
    const stdTimezoneOffset = Math.max(
      jan.getTimezoneOffset(),
      jul.getTimezoneOffset()
    );
    return this._date.getTimezoneOffset() < stdTimezoneOffset;
  }

  /**
   * Get the timezone offset in minutes
   * @returns {number} Timezone offset
   */
  get timezoneOffset() {
    return this._date.getTimezoneOffset();
  }

  /**
   * Get the timezone offset as string (+HH:mm or -HH:mm)
   * @returns {string} Timezone offset string
   */
  get timezoneOffsetString() {
    const offset = -this.timezoneOffset;
    const sign = offset >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;

    return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  /**
   * Convert to another timezone (simplified - assumes browser's timezone data)
   * @param {string} timezone - Target timezone (e.g., 'UTC', 'America/New_York')
   * @returns {DateTime} DateTime in target timezone
   */
  toTimezone(timezone) {
    if (timezone === "UTC") {
      const utcTime = new Date(this._date.toUTCString().slice(0, -4));
      return new DateTime(utcTime);
    }

    // For other timezones, we'd need a timezone database
    // This is a simplified version
    const offsetMatch = timezone.match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/);
    if (offsetMatch) {
      const sign = offsetMatch[1] === "+" ? 1 : -1;
      const hours = parseInt(offsetMatch[2]);
      const minutes = offsetMatch[3] ? parseInt(offsetMatch[3]) : 0;
      const offset = sign * (hours * 60 + minutes);

      const newDate = new Date(
        this.timestamp + (offset - this.timezoneOffset) * 60000
      );
      return new DateTime(newDate);
    }

    return this.clone(); // Fallback to clone
  }

  /**
   * Get the age in years from a reference date (default: today)
   * @param {DateTime|Date|string} [reference=DateTime.now()] - Reference date
   * @returns {number} Age in years
   */
  age(reference = DateTime.now()) {
    const ref = new DateTime(reference);
    let age = ref.year - this.year;
    const m = ref.month - this.month;

    if (m < 0 || (m === 0 && ref.day < this.day)) {
      age--;
    }

    return age;
  }

  /**
   * Check if this date is within a date range
   * @param {Object} range - Range object
   * @param {DateTime|Date|string} range.start - Start date
   * @param {DateTime|Date|string} range.end - End date
   * @param {boolean} [inclusive=true] - Include boundaries
   * @returns {boolean} True if within range
   */
  isInRange({ start, end }, inclusive = true) {
    return this.isBetween(start, end, inclusive);
  }

  /**
   * Get the number of days in the month
   * @returns {number} Days in month
   */
  daysInMonth() {
    return DateTime.daysInMonth(this.year, this.month);
  }

  /**
   * Check if year is a leap year
   * @returns {boolean} True if leap year
   */
  isLeapYear() {
    return DateTime.isLeapYear(this.year);
  }

  /**
   * Add business days (skip weekends)
   * @param {number} days - Number of business days to add
   * @returns {DateTime} New DateTime instance
   */
  addBusinessDays(days) {
    let result = this.clone();
    let daysAdded = 0;

    while (daysAdded < Math.abs(days)) {
      result = result.add(days > 0 ? 1 : -1, "day");
      if (result.isWeekday()) {
        daysAdded++;
      }
    }

    return result;
  }

  /**
   * Get the last day of the month
   * @returns {DateTime} Last day of month
   */
  endOfMonth() {
    return this.endOf("month");
  }

  /**
   * Get the first day of the month
   * @returns {DateTime} First day of month
   */
  startOfMonth() {
    return this.startOf("month");
  }

  /**
   * Get the last day of the year
   * @returns {DateTime} Last day of year
   */
  endOfYear() {
    return this.endOf("year");
  }

  /**
   * Get the first day of the year
   * @returns {DateTime} First day of year
   */
  startOfYear() {
    return this.startOf("year");
  }

  /**
   * Format as relative time (e.g., "2 days ago", "in 3 hours")
   * @returns {string} Relative time string
   */
  toRelative() {
    const now = DateTime.now();
    const diffMs = now.timestamp - this.timestamp;
    const absDiff = Math.abs(diffMs);

    const units = [
      { label: "year", ms: 31536000000 },
      { label: "month", ms: 2592000000 },
      { label: "week", ms: 604800000 },
      { label: "day", ms: 86400000 },
      { label: "hour", ms: 3600000 },
      { label: "minute", ms: 60000 },
      { label: "second", ms: 1000 },
    ];

    for (const unit of units) {
      const amount = Math.floor(absDiff / unit.ms);
      if (amount >= 1) {
        const plural = amount === 1 ? "" : "s";
        const direction = diffMs > 0 ? "ago" : "in";
        return `${amount} ${unit.label}${plural} ${direction}`;
      }
    }

    return "just now";
  }

  /**
   * Format as calendar time (e.g., "Yesterday", "Last Monday")
   * @returns {string} Calendar time string
   */
  toCalendar() {
    const today = DateTime.today();
    const yesterday = today.subtract(1, "day");
    const tomorrow = today.add(1, "day");

    if (this.isSame(today, "day")) return "Today";
    if (this.isSame(yesterday, "day")) return "Yesterday";
    if (this.isSame(tomorrow, "day")) return "Tomorrow";

    const diffDays = this.diff(today, "day");

    if (Math.abs(diffDays) < 7) {
      return this.format("dddd");
    }

    if (Math.abs(diffDays) < 14) {
      return diffDays > 0 ? "Next week" : "Last week";
    }

    return this.format("MMMM D, YYYY");
  }

  /**
   * Get all dates between this date and another date
   * @param {DateTime|Date|string} other - End date
   * @param {boolean} [inclusive=true] - Include both dates
   * @returns {DateTime[]} Array of dates
   */
  rangeTo(other, inclusive = true) {
    const end = new DateTime(other);
    const start = this.isBefore(end) ? this : end;
    const finish = this.isBefore(end) ? end : this;

    const dates = [];
    let current = start.clone();

    while (
      current.isBefore(finish) ||
      (inclusive && current.isSame(finish, "day"))
    ) {
      dates.push(current.clone());
      current = current.add(1, "day");
    }

    return dates;
  }

  /**
   * Get the human readable time difference
   * @param {DateTime|Date|string} other - Other date
   * @param {boolean} [detailed=false] - Return detailed string
   * @returns {string} Human readable difference
   */
  humanDiff(other, detailed = false) {
    const otherDt = new DateTime(other);
    const diffMs = this.timestamp - otherDt.timestamp;
    const absDiff = Math.abs(diffMs);

    if (detailed) {
      const units = [
        { label: "day", ms: 86400000 },
        { label: "hour", ms: 3600000 },
        { label: "minute", ms: 60000 },
        { label: "second", ms: 1000 },
      ];

      const parts = [];
      let remaining = absDiff;

      for (const unit of units) {
        const amount = Math.floor(remaining / unit.ms);
        if (amount > 0) {
          parts.push(`${amount} ${unit.label}${amount === 1 ? "" : "s"}`);
          remaining %= unit.ms;
        }
        if (parts.length >= 2) break; // Show max 2 units
      }

      const direction = diffMs > 0 ? "after" : "before";
      return `${parts.join(", ")} ${direction}`;
    }

    return this.toRelative();
  }

  /**
   * Convert to Unix timestamp (seconds since epoch)
   * @returns {number} Unix timestamp
   */
  unix() {
    return Math.floor(this.timestamp / 1000);
  }

  /**
   * Create from Unix timestamp
   * @param {number} timestamp - Unix timestamp
   * @returns {DateTime} DateTime instance
   */
  static fromUnix(timestamp) {
    return new DateTime(timestamp * 1000);
  }

  /**
   * Get the ISO week date string (YYYY-Www-D)
   * @returns {string} ISO week date
   */
  toISOWeekDate() {
    const weekNum = this.weekNumber;
    const dayOfWeek = this.dayOfWeek === 0 ? 7 : this.dayOfWeek; // ISO uses 1-7
    return `${this.year}-W${String(weekNum).padStart(2, "0")}-${dayOfWeek}`;
  }

  /**
   * Check if two date ranges overlap
   * @param {Object} range1 - First range
   * @param {Object} range2 - Second range
   * @returns {boolean} True if ranges overlap
   */
  static rangesOverlap(range1, range2) {
    const r1Start = new DateTime(range1.start);
    const r1End = new DateTime(range1.end);
    const r2Start = new DateTime(range2.start);
    const r2End = new DateTime(range2.end);

    return r1Start.isBefore(r2End) && r1End.isAfter(r2Start);
  }

  /**
   * Get the intersection of two date ranges
   * @param {Object} range1 - First range
   * @param {Object} range2 - Second range
   * @returns {Object|null} Intersection range or null
   */
  static rangeIntersection(range1, range2) {
    const r1Start = new DateTime(range1.start);
    const r1End = new DateTime(range1.end);
    const r2Start = new DateTime(range2.start);
    const r2End = new DateTime(range2.end);

    const start = DateTime.max(r1Start, r2Start);
    const end = DateTime.min(r1End, r2End);

    if (start.isAfter(end)) {
      return null;
    }

    return {
      start: start.toDate(),
      end: end.toDate(),
    };
  }

  // ============== GETTERS ==============

  get year() {
    return this._date.getFullYear();
  }

  get month() {
    return this._date.getMonth();
  }

  get day() {
    return this._date.getDate();
  }

  get hour() {
    return this._date.getHours();
  }

  get minute() {
    return this._date.getMinutes();
  }

  get second() {
    return this._date.getSeconds();
  }

  get millisecond() {
    return this._date.getMilliseconds();
  }

  get dayOfWeek() {
    return this._date.getDay();
  }

  get timestamp() {
    return this._date.getTime();
  }

  get isoString() {
    return this._date.toISOString();
  }

  // ============== VALIDATION ==============

  isValid() {
    return !isNaN(this._date.getTime());
  }

  isSame(other, unit = "millisecond") {
    const otherDt = other instanceof DateTime ? other : new DateTime(other);

    switch (unit) {
      case "year":
        return this.year === otherDt.year;
      case "month":
        return this.year === otherDt.year && this.month === otherDt.month;
      case "day":
        return (
          this.year === otherDt.year &&
          this.month === otherDt.month &&
          this.day === otherDt.day
        );
      case "hour":
        return (
          this.timestamp >= otherDt.timestamp &&
          this.timestamp < otherDt.add(1, "hour").timestamp
        );
      case "minute":
        return (
          this.timestamp >= otherDt.timestamp &&
          this.timestamp < otherDt.add(1, "minute").timestamp
        );
      default:
        return this.timestamp === otherDt.timestamp;
    }
  }

  isBefore(other) {
    const otherDt = other instanceof DateTime ? other : new DateTime(other);
    return this.timestamp < otherDt.timestamp;
  }

  isAfter(other) {
    const otherDt = other instanceof DateTime ? other : new DateTime(other);
    return this.timestamp > otherDt.timestamp;
  }

  isBetween(start, end, inclusive = true) {
    const startDt = start instanceof DateTime ? start : new DateTime(start);
    const endDt = end instanceof DateTime ? end : new DateTime(end);

    if (inclusive) {
      return (
        this.timestamp >= startDt.timestamp && this.timestamp <= endDt.timestamp
      );
    }
    return (
      this.timestamp > startDt.timestamp && this.timestamp < endDt.timestamp
    );
  }

  // ============== MANIPULATION ==============

  add(value, unit = "day") {
    const newDate = new Date(this.timestamp);

    switch (unit) {
      case "year":
        newDate.setFullYear(newDate.getFullYear() + value);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + value);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + value * 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() + value);
        break;
      case "hour":
        newDate.setHours(newDate.getHours() + value);
        break;
      case "minute":
        newDate.setMinutes(newDate.getMinutes() + value);
        break;
      case "second":
        newDate.setSeconds(newDate.getSeconds() + value);
        break;
      case "millisecond":
        newDate.setMilliseconds(newDate.getMilliseconds() + value);
        break;
    }

    return new DateTime(newDate);
  }

  subtract(value, unit = "day") {
    return this.add(-value, unit);
  }

  startOf(unit) {
    const newDate = new Date(this.timestamp);

    switch (unit) {
      case "year":
        newDate.setMonth(0, 1);
      // fall through
      case "month":
        newDate.setDate(1);
      // fall through
      case "day":
        newDate.setHours(0, 0, 0, 0);
        break;
      case "hour":
        newDate.setMinutes(0, 0, 0);
        break;
      case "minute":
        newDate.setSeconds(0, 0);
        break;
      case "second":
        newDate.setMilliseconds(0);
        break;
    }

    return new DateTime(newDate);
  }

  endOf(unit) {
    let result;

    switch (unit) {
      case "year":
        result = this.startOf("year").add(1, "year").subtract(1, "millisecond");
        break;
      case "month":
        result = this.startOf("month")
          .add(1, "month")
          .subtract(1, "millisecond");
        break;
      case "day":
        result = this.startOf("day").add(1, "day").subtract(1, "millisecond");
        break;
      case "hour":
        result = this.startOf("hour").add(1, "hour").subtract(1, "millisecond");
        break;
      case "minute":
        result = this.startOf("minute")
          .add(1, "minute")
          .subtract(1, "millisecond");
        break;
      case "second":
        result = this.startOf("second")
          .add(1, "second")
          .subtract(1, "millisecond");
        break;
      default:
        result = this;
    }

    return result;
  }

  // ============== FORMATTING ==============

  format(formatString = "YYYY-MM-DD HH:mm:ss") {
    const pad = (num, size = 2) => String(num).padStart(size, "0");

    const replacements = {
      YYYY: this.year,
      YY: String(this.year).slice(-2),
      MMMM: DateTime.monthNames[this.month],
      MMM: DateTime.monthNamesShort[this.month],
      MM: pad(this.month + 1),
      M: this.month + 1,
      DD: pad(this.day),
      D: this.day,
      dddd: DateTime.dayNames[this.dayOfWeek],
      ddd: DateTime.dayNamesShort[this.dayOfWeek],
      HH: pad(this.hour),
      H: this.hour,
      hh: pad(this.hour % 12 || 12),
      h: this.hour % 12 || 12,
      mm: pad(this.minute),
      m: this.minute,
      ss: pad(this.second),
      s: this.second,
      SSS: pad(this.millisecond, 3),
      A: this.hour < 12 ? "AM" : "PM",
      a: this.hour < 12 ? "am" : "pm",
    };

    return formatString.replace(
      /YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g,
      (match) => replacements[match]
    );
  }

  toJSON() {
    return this.isoString;
  }

  toString() {
    return this._date.toString();
  }

  toDate() {
    return new Date(this.timestamp);
  }

  // ============== DIFFERENCES ==============

  diff(other, unit = "millisecond") {
    const otherDt = other instanceof DateTime ? other : new DateTime(other);
    const diffMs = this.timestamp - otherDt.timestamp;

    switch (unit) {
      case "year":
        return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
      case "month":
        return Math.floor(diffMs / (30.44 * 24 * 60 * 60 * 1000));
      case "week":
        return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      case "day":
        return Math.floor(diffMs / (24 * 60 * 60 * 1000));
      case "hour":
        return Math.floor(diffMs / (60 * 60 * 1000));
      case "minute":
        return Math.floor(diffMs / (60 * 1000));
      case "second":
        return Math.floor(diffMs / 1000);
      default:
        return diffMs;
    }
  }

  // ============== UTILITIES ==============

  clone() {
    return new DateTime(this);
  }

  // Add these to the DateTime class

  /**
   * Get all months between this date and another date
   * @param {DateTime|Date|string} other - End date
   * @returns {string[]} Array of month names
   */
  monthsBetween(other) {
    const end = new DateTime(other);
    const start = this.isBefore(end) ? this : end;
    const finish = this.isBefore(end) ? end : this;

    const months = [];
    let current = start.startOf("month");

    while (current.isBefore(finish) || current.isSame(finish, "month")) {
      months.push(current.format("MMMM YYYY"));
      current = current.add(1, "month");
    }

    return months;
  }

  /**
   * Get the fiscal quarter (customizable start month)
   * @param {number} [fiscalStartMonth=0] - Fiscal year start month (0-11)
   * @returns {number} Fiscal quarter (1-4)
   */
  fiscalQuarter(fiscalStartMonth = 0) {
    const adjustedMonth = (this.month - fiscalStartMonth + 12) % 12;
    return Math.floor(adjustedMonth / 3) + 1;
  }

  /**
   * Get the fiscal year (customizable start month)
   * @param {number} [fiscalStartMonth=0] - Fiscal year start month (0-11)
   * @returns {number} Fiscal year
   */
  fiscalYear(fiscalStartMonth = 0) {
    const fiscalYear =
      this.month >= fiscalStartMonth ? this.year : this.year - 1;
    return fiscalYear;
  }

  /**
   * Check if time is in AM
   * @returns {boolean} True if AM
   */
  isAM() {
    return this.hour < 12;
  }

  /**
   * Check if time is in PM
   * @returns {boolean} True if PM
   */
  isPM() {
    return this.hour >= 12;
  }

  /**
   * Round to nearest time unit
   * @param {string} unit - Time unit to round to
   * @param {number} [value=1] - Value to round to (e.g., 15 for nearest 15 minutes)
   * @returns {DateTime} Rounded DateTime
   */
  round(unit, value = 1) {
    const roundMap = {
      minute: 60000,
      hour: 3600000,
      day: 86400000,
    };

    const ms = roundMap[unit] || 60000;
    const roundMs = ms * value;
    const rounded = Math.round(this.timestamp / roundMs) * roundMs;

    return new DateTime(rounded);
  }

  /**
   * Get date as ordinal string (1st, 2nd, 3rd, 4th, etc.)
   * @returns {string} Date with ordinal
   */
  toOrdinalString() {
    const day = this.day;
    const suffix = ["th", "st", "nd", "rd"][
      day % 100 > 10 && day % 100 < 20 ? 0 : day % 10
    ];
    return `${day}${suffix}`;
  }

  /**
   * Check if date is in the past
   * @returns {boolean} True if past
   */
  isPast() {
    return this.isBefore(DateTime.now());
  }

  /**
   * Check if date is in the future
   * @returns {boolean} True if future
   */
  isFuture() {
    return this.isAfter(DateTime.now());
  }

  /**
   * Get the duration between two dates as object
   * @param {DateTime|Date|string} other - Other date
   * @returns {Object} Duration object
   */
  duration(other) {
    const otherDt = new DateTime(other);
    const diffMs = Math.abs(this.timestamp - otherDt.timestamp);

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
      milliseconds: diffMs,
      seconds: seconds % 60,
      minutes: minutes % 60,
      hours: hours % 24,
      days,
      weeks: Math.floor(days / 7),
      months: Math.floor(days / 30.44),
      years: Math.floor(days / 365.25),
    };
  }

  /**
   * Check if date is the last day of the month
   * @returns {boolean} True if last day of month
   */
  isLastDayOfMonth() {
    return this.day === this.daysInMonth();
  }

  /**
   * Check if date is the first day of the month
   * @returns {boolean} True if first day of month
   */
  isFirstDayOfMonth() {
    return this.day === 1;
  }

  /**
   * Get the week of month (1-5)
   * @returns {number} Week of month
   */
  weekOfMonth() {
    const firstDay = this.startOf("month");
    const firstWeekday = firstDay.dayOfWeek;
    const offset = (this.day + firstWeekday - 1) / 7;
    return Math.ceil(offset);
  }

  // ============== STATIC PROPERTIES ==============

  static monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  static monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  static dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  static dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

export default DateTime;
