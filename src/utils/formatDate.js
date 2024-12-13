/**
 * Formats a given ISO date string into a more readable date and time format.
 *
 * This function takes an ISO 8601 date string as input and returns a formatted string 
 * that includes the day of the week, the year, the month, the day, and the time in 12-hour format (AM/PM).
 * 
 * @since 1.0.0
 * @version 1.0.0
 *
 * @package DateUtilities
 * 
 * @author OOm Developer (oom_ss)
 *
 * @example
 * const formattedDate = formatDate("2024-11-25T07:56:00Z");
 * console.log(formattedDate); // Outputs: "Monday, November 25, 2024, 07:56 AM"
 *
 * @param {string} isoDate - The ISO 8601 date string to be formatted (e.g., "2024-11-25T07:56:00Z").
 * @returns {string} The formatted date string in the format: "Weekday, Month Day, Year, HH:MM AM/PM".
 * 
 * @throws {TypeError} If the input is not a valid ISO 8601 date string.
 */

export const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    return date.toLocaleString('en-US', {
        weekday: 'long',  // "Monday"
        year: 'numeric',  // "2024"
        month: 'long',    // "November"
        day: 'numeric',   // "25"
        hour: '2-digit',  // "07"
        minute: '2-digit',// "56"
        hour12: true,     // 12-hour format (AM/PM)
    });
};