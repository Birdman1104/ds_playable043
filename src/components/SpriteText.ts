import { Container } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import { getNumberSpriteConfig } from '../configs/SpriteConfig';
import { makeSprite } from '../utils/Utils';

export class SpriteText extends Container {
  private tint: number = 0xffffff;
  private sprites: Sprite[] = [];
  private originalLength: number;
  constructor(private string: string, private atlas: string, tint?: number) {
    super();
    this.originalLength = this.string.length;
    tint && (this.tint = tint);

    setTimeout(() => this.init(), 0);
  }

  public getBounds(): Rectangle {
    const w = this.string.length * 20;
    return new Rectangle(0, -25, w, 50);
  }

  public setTint(tint: number): void {
    this.tint = tint;
    this.sprites.forEach((s) => (s.tint = tint));
  }

  public updateString(str: string): void {
    this.string = str;
    this.sprites.forEach((sprite) => this.removeChild(sprite));
    this.sprites = [];
    this.init();
  }

  private init(): void {
    const numbers = this.string.toString().split('');
    numbers.forEach((num, i) => {
      const str = `${this.atlas}_${num === '/' ? 'slash' : `${num}`}`;
      const sprite = makeSprite(getNumberSpriteConfig(str, this.atlas));
      const x =
        i === 0
          ? sprite.width / 2
          : this.sprites[i - 1].x + this.sprites[i - 1].width / 2 + sprite.width / 2 + 3;
      sprite.x = x;
      this.sprites.push(sprite);
      sprite.tint = this.tint;
      this.addChild(sprite);
    });
  }
}
