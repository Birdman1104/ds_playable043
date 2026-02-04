import { Container } from '@pixi/display';
import { getPreloadGridConfig } from 'configs/gridConfigs/PreloadViewGC';
import { PixiGrid } from 'libs/grid';

export class PreloadView extends PixiGrid {
  constructor() {
    super();
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getPreloadGridConfig();
  }

  public rebuild(config?: ICellConfig | undefined): void {
    super.rebuild(this.getGridConfig());
  }

  public updateProgress(progress: number): void {
    //
  }

  private build(): void {
    this.buildLogo();
    this.buildProgressBar();
  }

  private buildLogo(): void {
    //
  }

  private buildProgressBar(): void {
    const container = new Container();
    //
  }
}
