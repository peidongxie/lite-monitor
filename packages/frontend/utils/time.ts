const format = (time: number | Date, pattern: string): string => {
  const date = new Date(time);
  const regExpList: [RegExp, string][] = [
    [/y+/g, String(date.getFullYear())],
    [/M+/g, String(date.getMonth() + 1)],
    [/d+/g, String(date.getDay())],
    [/H+/g, String(date.getHours())],
    [/m+/g, String(date.getMinutes())],
    [/s+/g, String(date.getSeconds())],
    [/S+/g, String(date.getMilliseconds())],
  ];
  let s = pattern;
  for (const [searchValue, replaceValue] of regExpList) {
    s = s.replace(searchValue, (searchValue: string): string => {
      const searchLength = searchValue.length;
      const replaceLength = replaceValue.length;
      return replaceValue
        .substring(replaceLength - searchLength, replaceLength)
        .padStart(searchLength, '0');
    });
  }
  return s;
};

export { format };
