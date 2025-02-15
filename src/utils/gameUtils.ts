export const decodeHtmlEntity = (entity: string | string[]): string => {
  if (Array.isArray(entity) && entity.length === 2) {
    const [code1, code2] = entity.map((code) => {
      const match = /&#(\d+);/.exec(code);
      return match ? String.fromCodePoint(parseInt(match[1], 10)) : "";
    });
    return code1 + code2;
  }

  if (typeof entity === "string") {
    const numericMatch = /&#(\d+);/.exec(entity);
    if (numericMatch) {
      return String.fromCodePoint(parseInt(numericMatch[1], 10));
    }
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = Array.isArray(entity) ? entity.join("") : entity;
  return textarea.value;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
