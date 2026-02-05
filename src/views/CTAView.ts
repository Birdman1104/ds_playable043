import { lego } from '@armathai/lego';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import anime from 'animejs';
import { PixiGrid } from 'libs/grid';
import { getCTAGridConfig } from '../configs/gridConfigs/CTAViewGC';
import { CtaModelEvents } from '../lego/events/ModelEvents';

export class CTAView extends PixiGrid {
  private blocker: Graphics = new Graphics();
  private content: Container = new Container();

  constructor() {
    super();

    lego.event.on(CtaModelEvents.VisibleUpdate, this.visibleUpdate, this);
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getCTAGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private build(): void {
    this.buildBlocker();
  }

  private buildBlocker(): void {
    this.blocker.beginFill(0x000000, 1);
    this.blocker.drawRect(0, 0, 10, 10);
    this.blocker.endFill();
    this.blocker.alpha = 0;
    this.attach('blocker', this.blocker);
  }

  private visibleUpdate(visible: boolean): void {
    if (visible) {
      this.showBlocker();
    } else {
      this.blocker.eventMode = 'none';
      this.blocker.alpha = 0;
    }
  }

  private showBlocker(): void {
    this.blocker.eventMode = 'static';
    anime({
      targets: this.blocker,
      alpha: 0.4,
      duration: 300 / 2.5,
      easing: 'linear',
    });
    this.blocker.on('pointerdown', () => {
      // lego.event.emit(TakeMe.ToStore);
    });
  }
}
