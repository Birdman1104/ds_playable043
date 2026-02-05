import { lego } from '@armathai/lego';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';
import { GameModelEvents } from 'lego/events/ModelEvents';
import { PixiGrid } from 'libs/grid';
import { GameState } from 'models/GameModel';
import { getForegroundGridConfig } from '../configs/gridConfigs/ForegroundViewGC';
import { getLogoSpriteConfig } from '../configs/SpriteConfig';
import { CTAEvents } from '../lego/events/MainEvents';
import { makeSprite } from '../utils/Utils';

class Logo extends Container {
  private logo1: Sprite | null = null;
  private logo2: Sprite | null = null;
  constructor() {
    super();

    this.logo1 = makeSprite(getLogoSpriteConfig(1, 0, 0));
    this.logo2 = makeSprite(getLogoSpriteConfig(2, 0, 0));
    this.addChild(this.logo1);
    this.addChild(this.logo2);

    this.logo2.alpha = 0;

    this.logo1.eventMode = 'static';
    this.logo1.on('pointerdown', () => {
      lego.event.emit(CTAEvents.TakeToStore);
    });

    anime({
      targets: this.logo2,
      alpha: 1,
      duration: 800,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
    });
  }
}
export class ForegroundView extends PixiGrid {
  private logo: Logo = new Logo();

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
