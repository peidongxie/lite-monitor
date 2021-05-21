export const format = (time: number | Date, pattern: string): string => {
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
  for (const [regexp, replaceValue] of regExpList) {
    for (const searchValue of (pattern.match(regexp) || []).sort().reverse()) {
      const searchLength = searchValue.length;
      const replaceLength = replaceValue.length;
      if (searchLength > replaceLength) {
        s = s.replace(searchValue, replaceValue.padStart(searchLength, '0'));
      } else {
        s = s.replace(
          searchValue,
          replaceValue.substr(replaceLength - searchLength, searchLength),
        );
      }
    }
  }
  return s;
};
