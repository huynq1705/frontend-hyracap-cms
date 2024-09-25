export function areValidImageNames(imageString: any) {
  // Array of accepted image file extensions
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  // Regular expression to check if a file name ends with one of the image file extensions
  const imagePattern = new RegExp(`\\.(${imageExtensions.join("|")})$`, "i");
  // Split the input string into individual file names
  const imageNames = imageString.split(",");
  // Check each file name
  for (const imageName of imageNames) {
    if (!imagePattern.test(imageName.trim())) {
      return false; // If any file name does not match, return false
    }
  }
  return true; // All file names are valid
}
export function areValidImageLinks(imageString: any) {
  // Array of accepted image file extensions
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

  // Regular expression to check if a URL ends with one of the image file extensions
  const imagePattern = new RegExp(
    `\\.(${imageExtensions.join("|")})(\\?.*)?$`,
    "i",
  );

  // Split the input string into individual URLs
  const imageLinks = imageString.split(",");

  // Check each URL
  for (const imageLink of imageLinks) {
    if (!imagePattern.test(imageLink.trim())) {
      return false; // If any URL does not match, return false
    }
  }

  return true; // All URLs are valid image links
}
