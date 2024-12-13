/**
 * Formats a number to a human-readable string with suffixes for thousands or millions.
 *
 * This function takes a number and converts it into a string with a `k` (for thousands) or `M` (for millions) suffix, 
 * making large numbers easier to read at a glance. The number is rounded to one decimal place when applicable.
 *
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @package NumberUtilities
 * 
 * @author OOm Developer (oom_ss)
 *
 * @example
 * const formattedNumber = formatNumber(1500000);
 * console.log(formattedNumber); // Outputs: "1.5M"
 *
 * @param {number} num - The number to be formatted.
 * @returns {string} The formatted number with the appropriate suffix (e.g., 'k' or 'M').
 */

export const formatNumber = (num) => {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'M';  // For millions
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'k';  // For thousands
    }
    return num;  // For numbers less than 1000
};