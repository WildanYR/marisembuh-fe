export class Debouncer {
  timer: number | undefined;

  debounce(callback: any, timeoutMs: number) {
    return (...args: any) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => callback(...args), timeoutMs);
    };
  }

  clearTimer() {
    clearTimeout(this.timer);
  }
}
