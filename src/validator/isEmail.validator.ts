export default (value: string): string => {
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
    return "bukan email valid";
  return "";
};
