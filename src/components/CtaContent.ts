import { getLogoSpriteConfig } from '../configs/SpriteConfig';
import { makeSprite } from '../utils/Utils';

import { Container } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import anime from 'animejs';

export enum CTAContentType {
  Win = 'win',
  Lose = 'lose',
}

export class CtaContent extends Container {
  constructor(private _type: CTAContentType) {
    super();

    this.init();
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, 1200, 1200);
  }

  get type(): CTAContentType {
    return this._type;
  }

  public show(): void {
    anime({
      targets: this,
      alpha: 1,
      duration: 300,
      easing: 'linear',
    });
  }

  private init(): void {
    this._type === CTAContentType.Win ? this.initWinContent() : this.initLoseContent();
    this.initPlayNowBtn();

    this.alpha = 0;
  }

  private initWinContent(): void {
    const logo = makeSprite(getLogoSpriteConfig(1, 600, 120, 1.5));

    this.addChild(logo);

    anime({
      targets: logo,
      alpha: 0,
      duration: 300,
      easing: 'easeInOutSine',
    });
  }

  private initLoseContent(): void {
    const failImage = makeSprite(getLogoSpriteConfig(1, 600, 250));
    this.addChild(failImage);
  }

  private initPlayNowBtn(): void {
    const container = new Container();
    container.position.set(600, 1050);
    this.addChild(container);

    anime({
      targets: container.scale,
      x: [1.3, 1, 1.15, 1],
      y: [1.3, 1, 1.15, 1],
      duration: 1500,
      easing: 'easeInOutQuad',
      loop: true,
      delay: 500,
    });
  }
}
