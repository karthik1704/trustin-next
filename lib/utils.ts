import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: string | string[] | Object) => {
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error.map(e=>e.msg).join("/n");
  if (typeof error === "object") {
    // TODO: Need Imporement Here
    console.log(error);
    return "Something Went Wrong, Check field again.";
  }
};

export function formatDate(dateString: string | Date) {
  // Define the date
  let date = new Date(dateString);

  // Extract day, month, and year components
  let day: string | number = date.getDate();
  let month: string | number = date.getMonth() + 1; // Note: January is 0, so we add 1
  let year = date.getFullYear();

  // Format day and month to have leading zeros if necessary
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Rearrange components in DD-MM-YYYY format
  let formattedDate = day + "-" + month + "-" + year;

  return formattedDate;
}

export function getDateRange() {
  // Get the current date
  const endDate = new Date();

  // Calculate the start date by subtracting 7 days from the current date
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);

  return { startDate, endDate };
}

export function parseFormattedDate(formattedDate: string): string  {
  // Split the formatted date string into day, month, and year components
  const [day, month, year] = formattedDate.split('-').map(Number);

  // Validate the components
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error('Invalid formatted date string');
    return '';
  }

  // Create a new Date object
  const date = new Date(year, month - 1, day); // Note: Month is 0-indexed in Date constructor

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date');
    return "";
  }


  // Rearrange components in YYYY-MM-DD format
  const isoFormattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

  return isoFormattedDate;
}


export function getCurrentLocalISOString() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localISOString = new Date(date.getTime() - (offset * 60 * 1000)).toISOString();
  return localISOString;
}

export function convertToLocalISOString(timestring:string) {
  // Create a Date object from the provided timestring
  const date = new Date(timestring);

  // Get the current timezone offset in minutes
  const offset = date.getTimezoneOffset();

  // Adjust the date to get the local time
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));

  // Get the ISO string representation of the local date
  const localISOString = localDate.toISOString();

  return localISOString;
}
