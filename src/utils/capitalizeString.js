/**
 * Capitalizes the first letter of each word in a given string.
 *
 * This function takes a string, converts it to lowercase, and then capitalizes the first letter of each word.
 * Words are assumed to be separated by spaces. The function returns a new string with the desired capitalization.
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @package StringUtilities
 * 
 * @author OOm Developer (oom_ss)
 *
 * @example
 * const capitalizedString = capitalizeString("hello world");
 * console.log(capitalizedString); // Outputs: "Hello World"
 *
 * @param {string} str - The string to be capitalized.
 * @returns {string} A new string with the first letter of each word capitalized.
 * 
 * @throws {TypeError} If the input is not a string.
 */

export const capitalizeString = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};