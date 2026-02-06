import { lego } from '@armathai/lego';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Rectangle } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';
import { PixiGrid } from 'libs/grid';
import { getCTAGridConfig } from '../configs/gridConfigs/CTAViewGC';
import { getButtonSpriteConfig, getLogoSpriteConfig } from '../configs/SpriteConfig';
import { CTAEvents } from '../lego/events/MainEvents';
import { CtaModelEvents } from '../lego/events/ModelEvents';
import { makeSprite } from '../utils/Utils';

export class CTAView extends PixiGrid {
  private blocker: Graphics = new Graphics();
  private logoWrapper: Container = new Container();
  private logo: Sprite = makeSprite(getLogoSpriteConfig(1, 0, 0));
  private buttonWrapper: Container = new Container();
  private button: Sprite = makeSprite(getButtonSpriteConfig());

  constructor() {
    super();

    lego.event.on(CtaModelEvents.VisibleUpdate, this.visibleUpdate, this);

    this.buildBlocker();
    this.attach('logo', this.logoWrapper);
    this.attach('button', this.buttonWrapper);
    this.logoWrapper.getBounds = () => new Rectangle(0, 0, 450, 250);
    this.buttonWrapper.getBounds = () => new Rectangle(0, 0, 305, 105);
    this.logoWrapper.addChild(this.logo);
    this.buttonWrapper.addChild(this.button);
    this.button.alpha = 0;
    this.logo.alpha = 0;
    this.logo.position.set(this.logoWrapper.width / 2, this.logoWrapper.height / 2);
    this.button.position.set(this.buttonWrapper.width / 2, this.buttonWrapper.height / 2);
    this.logo.scale.set(0.01);
    this.button.scale.set(2);

    this.rebuild();
  }

  public getGridConfig(): ICellConfig {
    return getCTAGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
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
      const easing = 'easeInOutCubic';
      const duration = 500;
      anime({
        targets: [this.logo, this.button],
        alpha: 1,
        duration: 300,
        easing,
      });
      anime({
        targets: this.button.scale,
        x: 0.4,
        y: 0.4,
        duration,
        easing: 'easeOutBack',
        complete: () => {
          anime({
            targets: this.button.scale,
            x: 0.25,
            y: 0.25,
            duration: 300,
            loop: true,
            delay: 1000,
            direction: 'alternate',
            easing: 'easeInOutCubic',
          });
        },
      });
      anime({
        targets: this.logo.scale,
        y: 1,
        duration: 400,
        easing: 'easeOutBack',
      });
      anime({
        targets: this.logo.scale,
        x: 1,
        duration: 500,
        easing: 'easeInOutCubic',
      });
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
      lego.event.emit(CTAEvents.TakeToStore);
    });
  }
}
