/**
 * Validates if a string is a properly formatted URL
 * @param urlString - The string to validate as a URL
 * @returns boolean indicating if the string is a valid URL
 * @example
 * isValidUrl('https://example.com') // returns true
 * isValidUrl('not-a-url') // returns false
 */
export const isValidUrl = (urlString: string): boolean => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!urlPattern.test(urlString);
};

// You can also add type for the validation result if you need more details
export interface UrlValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates a URL and returns a detailed result
 * @param urlString - The string to validate as a URL
 * @returns An object containing validation result and optional error message
 */
export const validateUrl = (urlString: string): UrlValidationResult => {
  if (!urlString) {
    return {
      isValid: false,
      message: "URL cannot be empty",
    };
  }

  return {
    isValid: isValidUrl(urlString),
    message: isValidUrl(urlString) ? undefined : "Invalid URL format",
  };
};
