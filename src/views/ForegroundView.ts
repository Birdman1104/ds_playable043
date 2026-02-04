import { lego } from '@armathai/lego';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';
import { GameModelEvents } from 'lego/events/ModelEvents';
import { PixiGrid } from 'libs/grid';
import { GameState } from 'models/GameModel';
import { getForegroundGridConfig } from '../configs/gridConfigs/ForegroundViewGC';
import { getLogoSpriteConfig } from '../configs/SpriteConfig';
import { CTAEvents } from '../lego/events/MainEvents';
import { makeSprite } from '../utils/Utils';

export class ForegroundView extends PixiGrid {
  private logo: Sprite | null = null;

  constructor() {
    super();

    lego.event.on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);

    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getForegroundGridConfig();
  }

  public rebuild(config?: ICellConfig | undefined): void {
    super.rebuild(this.getGridConfig());
  }

  private build(): void {
    this.initLogo();
  }

  private initLogo(): void {
    this.logo = makeSprite(getLogoSpriteConfig(0, 0));
    this.logo.eventMode = 'static';
    this.logo.on('pointerdown', () => {
      lego.event.emit(CTAEvents.TakeToStore);
    });
    this.attach('logo', this.logo);
  }

  private onGameStateUpdate(state: GameState): void {
    if (this.logo && state === GameState.Win) {
      this.logo.eventMode = 'none';
      anime({
        targets: this.logo,
        alpha: 0,
        duration: 100,
        easing: 'easeInOutSine',
      });
    }
  }
}
