export class AnalyticsController {
  public static customLog(name: string, ...args: any[]): void {
    // @ts-ignore
    window.pi?.logCustomEvent(name, ...args);
  }
}
