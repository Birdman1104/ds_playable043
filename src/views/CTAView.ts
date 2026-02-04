import { lego } from '@armathai/lego';
import { Graphics } from '@pixi/graphics';
import anime from 'animejs';
import { PixiGrid } from 'libs/grid';
import { CtaContent, CTAContentType } from '../components/CtaContent';
import { getCTAGridConfig } from '../configs/gridConfigs/CTAViewGC';
import { CtaModelEvents, GameModelEvents } from '../lego/events/ModelEvents';
import { GameState } from '../models/GameModel';

export class CTAView extends PixiGrid {
  private blocker: Graphics = new Graphics();
  private content: CtaContent | undefined;

  private canShowContent = false;
  private hasShownContent = false;

  constructor() {
    super();

    lego.event
      .on(CtaModelEvents.VisibleUpdate, this.visibleUpdate, this)
      .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getCTAGridConfig();
  }

  public rebuild(config?: ICellConfig | undefined): void {
    super.rebuild(this.getGridConfig());
  }

  private onGameStateUpdate(state: GameState): void {
    if (state === GameState.Win || state === GameState.Lose) {
      this.content = new CtaContent(
        state === GameState.Win ? CTAContentType.Win : CTAContentType.Lose,
      );

      this.canShowContent = true;

      if (state === GameState.Lose && !this.hasShownContent) {
        this.hasShownContent = true;
        this.attach('content', this.content);
        this.content.show();
        this.showBlocker();
      }
    }
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
      // this.showBlocker();
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
