export class AnalyticsController {
  public static customLog(index: number): void {
    // @ts-ignore
    window.pi?.logCustomEvent('custom_log', index);
  }
}
