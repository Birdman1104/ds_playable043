import { lego } from '@armathai/lego';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';
import { AdModelEvents, GameModelEvents, SoundModelEvents } from 'lego/events/ModelEvents';
import { PixiGrid } from 'libs/grid';
import { GameState } from 'models/GameModel';
import { getForegroundGridConfig } from '../configs/gridConfigs/ForegroundViewGC';
import { getLogoSpriteConfig } from '../configs/SpriteConfig';
import { CTAEvents, SoundEvents } from '../lego/events/MainEvents';
import { SoundModel, SoundState } from '../models/SoundModel';
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

class Sound extends Container {
  private isMuted = true;
  private icon: Sprite = makeSprite({
    frame: this.isMuted ? 'sound_off.png' : 'sound_on.png',
    atlas: 'game',
  });

  constructor() {
    super();

    lego.event.on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this);
    this.build();
  }

  private build(): void {
    this.icon.eventMode = 'static';
    this.icon.on('pointerdown', this.onPointerDown, this);
    this.addChild(this.icon);
  }

  private onPointerDown(): void {
    lego.event.emit(this.isMuted ? SoundEvents.Unmute : SoundEvents.Mute);
  }

  private onSoundStateUpdate(state: SoundState): void {
    this.isMuted = state === SoundState.Off;
    this.icon.texture = Texture.from(`sound_${this.isMuted ? 'off' : 'on'}.png`);
  }
}

export class ForegroundView extends PixiGrid {
  private logo: Logo = new Logo();
  private sound: Sound = new Sound();

  constructor() {
    super();

    lego.event
      .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this)
      .on(AdModelEvents.SoundUpdate, this.onSoundUpdate, this)
      .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this);

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

  private onSoundUpdate(sound: SoundModel): void {
    if (sound) {
      this.attach('sound', this.sound);
    }
  }

  private onSoundStateUpdate(soundState: SoundState): void {
    // this.sound.mutedUpdate(soundState === SoundState.Off);
  }
}
