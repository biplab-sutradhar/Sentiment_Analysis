export function findMissingPart(str1: string, str2: string): string {
  const words1 = str1.split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);

  const missingWords: string[] = [];
  for (const word of words1) {
    const lowerCaseWord = word.toLowerCase();
    if (!words2.includes(lowerCaseWord)) {
      missingWords.push(word);
    }
  }

  return missingWords.join(" ");
}