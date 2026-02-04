import { lego } from '@armathai/lego';
import { Container } from '@pixi/display';
import { Point } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';
import { getHintSpriteConfig } from 'configs/SpriteConfig';
import { HintModelEvents } from 'lego/events/ModelEvents';
import { makeSprite } from 'utils/Utils';

export class HintView extends Container {
  private circle: Sprite | null = null;
  private hintPositions: Point[] = [];

  constructor() {
    super();

    lego.event.on(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this);

    this.build();
    this.hide();
  }

  get viewName() {
    return 'HintView';
  }

  public destroy(): void {
    this.removeTweens();
    lego.event.off(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this);

    super.destroy();
  }

  private onHintVisibleUpdate(visible: boolean): void {
    visible ? this.show() : this.hide();
  }

  private build(): void {
    this.circle = makeSprite(getHintSpriteConfig());
    this.circle.visible = false;
    this.addChild(this.circle);
  }

  private show(): void {
    this.removeTweens();

    this.animateCircle();
  }

  private hide(): void {
    if (!this.circle) return;
    this.removeTweens();
    this.circle.visible = false;
  }

  private animateCircle(): void {
    if (!this.circle) return;
    this.circle.visible = true;
    const point = this.getHintPosition();
    this.circle.scale.set(0.5);
    this.circle.alpha = 1;
    this.circle.position.set(point.x, point.y);
    this.circle.angle = 0;
    this.circle.visible = true;

    this.pointHand();
  }

  private pointHand(): void {
    if (!this.circle) return;
    anime({
      targets: this.circle.scale,
      x: 0.25,
      y: 0.25,
      duration: 350,
      easing: 'easeInOutCubic',
      direction: 'alternate',
      loop: true,
    });
  }

  private removeTweens(): void {
    if (this.circle) {
      anime.remove(this.circle);
      anime.remove(this.circle.scale);
    }
  }

  private getHintPosition(): Point {
    // return this.toLocal((this.parent as WorldMap).getHintPosition());
    return new Point(0, 0);
  }
}
