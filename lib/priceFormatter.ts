/**
 * Formats a price number to Danish format
 * Uses . as thousand separator and , as decimal separator
 * 
 * @param price - The price as a number
 * @returns Formatted price string in Danish format
 * 
 * @example
 * formatDanishPrice(1234.56) // "1.234,56"
 * formatDanishPrice(999) // "999"
 * formatDanishPrice(1000000) // "1.000.000"
 */
export function formatDanishPrice(price: number): string {
  // Handle edge cases
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }

  // Convert to string and split by decimal point
  const priceStr = price.toString();
  const [integerPart, decimalPart] = priceStr.split('.');

  // Add thousand separators to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // If there's a decimal part, add it with comma separator
  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
}

/**
 * Formats a price with currency suffix
 * 
 * @param price - The price as a number
 * @param currency - The currency suffix (default: 'kr')
 * @returns Formatted price string with currency
 * 
 * @example
 * formatPriceWithCurrency(1234.56) // "1.234,56 kr"
 * formatPriceWithCurrency(999) // "999 kr"
 */
export function formatPriceWithCurrency(price: number, currency: string = 'kr'): string {
  const formattedPrice = formatDanishPrice(price);
  return `${formattedPrice} ${currency}`;
}
