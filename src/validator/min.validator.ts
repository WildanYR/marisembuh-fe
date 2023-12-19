export default (min: number) => {
  return (value: any): string => {
    if (typeof value === "number" && value < min) return `minimal ${min}`;
    if (typeof value === "string" && value.length < min)
      return `minimal ${min} karakter`;
    return "";
  };
};
