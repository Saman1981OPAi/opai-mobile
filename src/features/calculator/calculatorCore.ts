export type ConversionKind = "distance-short" | "distance-long" | "weight" | "temperature" | "speed" | "velocity";

const factors = {
  "distance-short": 3.280839895,
  "distance-long": 0.6213711922,
  weight: 2.2046226218,
  speed: 0.6213711922,
  velocity: 3.6
} as const;

export function parseFiniteNumber(value: string) {
  if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(value.trim())) throw new Error("Enter a valid number.");
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error("Enter a number within a supported range.");
  return number;
}

export function cleanNumber(value: number, precision = 4) {
  if (!Number.isFinite(value)) throw new Error("The result is outside the supported range.");
  return Number(value.toFixed(precision)).toString();
}

export function convertUnit(kind: ConversionKind, value: number, reverse = false) {
  if (kind === "temperature") return reverse ? (value - 32) * 5 / 9 : value * 9 / 5 + 32;
  const factor = factors[kind];
  return reverse ? value / factor : value * factor;
}

export function elapsedMinutes(start: string, end: string) {
  const pattern = /^(\d{1,2}):(\d{2})$/;
  const startMatch = start.match(pattern);
  const endMatch = end.match(pattern);
  if (!startMatch || !endMatch) throw new Error("Use 24-hour time in HH:MM format.");
  const startHour = Number(startMatch[1]);
  const startMinute = Number(startMatch[2]);
  const endHour = Number(endMatch[1]);
  const endMinute = Number(endMatch[2]);
  if (startHour > 23 || endHour > 23 || startMinute > 59 || endMinute > 59) throw new Error("Enter a valid time.");
  let difference = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (difference < 0) difference += 24 * 60;
  return difference;
}

export function ageOnDate(dateOfBirth: string, onDate = new Date()) {
  const birth = new Date(`${dateOfBirth}T12:00:00`);
  if (Number.isNaN(birth.getTime()) || birth > onDate) throw new Error("Enter a valid date of birth.");
  let age = onDate.getFullYear() - birth.getFullYear();
  const beforeBirthday = onDate.getMonth() < birth.getMonth() || (onDate.getMonth() === birth.getMonth() && onDate.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function decimalToDms(value: number) {
  if (value < -180 || value > 180) throw new Error("Decimal degrees must be between -180 and 180.");
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  return { degrees: degrees * sign, minutes, seconds: Number(seconds.toFixed(2)) };
}

export function dmsToDecimal(degrees: number, minutes: number, seconds: number) {
  if (Math.abs(degrees) > 180 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) throw new Error("Enter valid degrees, minutes, and seconds.");
  const sign = degrees < 0 ? -1 : 1;
  return sign * (Math.abs(degrees) + minutes / 60 + seconds / 3600);
}

export function basicArithmetic(left: number, operator: "+" | "-" | "x" | "/" | "%", right: number) {
  if (operator === "+") return left + right;
  if (operator === "-") return left - right;
  if (operator === "x") return left * right;
  if (operator === "%") return left * right / 100;
  if (right === 0) throw new Error("Cannot divide by zero.");
  return left / right;
}

