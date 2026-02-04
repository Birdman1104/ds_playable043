import { lego } from '@armathai/lego';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { getSoundButtonSpriteConfig } from 'configs/SpriteConfig';
import { UIEvents } from 'lego/events/MainEvents';
import { makeSprite } from 'utils/Utils';

export class SoundButton extends Container {
  private isMuted = false;
  private icon: Sprite | null = null;

  constructor() {
    super();

    this.build();
  }

  public mutedUpdate(isMuted: boolean): void {
    this.isMuted = isMuted;
    this.icon && (this.icon.texture = Texture.from(`sound_${this.isMuted ? 'off' : 'on'}.png`));
  }

  private build(): void {
    this.icon = makeSprite(getSoundButtonSpriteConfig(this.isMuted ? 'off' : 'on'));

    this.icon.eventMode = 'static';
    this.icon.on('pointerdown', this.onPointerDown, this);
    this.addChild(this.icon);
  }

  private onPointerDown(): void {
    lego.event.emit(UIEvents.SoundButtonClick);
  }
}
