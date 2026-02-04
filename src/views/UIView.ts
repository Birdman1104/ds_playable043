import { lego } from '@armathai/lego';
import { Sprite } from '@pixi/sprite';
import anime from 'animejs';
import { SoundButton } from 'components/SoundButton';
import { CTAEvents } from 'lego/events/MainEvents';
import { GameModelEvents, SoundModelEvents } from 'lego/events/ModelEvents';
import { PixiGrid } from 'libs/grid';
import { GameState } from 'models/GameModel';
import { SoundState } from 'models/SoundModel';
import { getUIGridConfig } from '../configs/gridConfigs/UIViewGC';
import { getPCtaSpriteConfig } from '../configs/SpriteConfig';
import { makeSprite } from '../utils/Utils';

export class UIView extends PixiGrid {
  private pcta!: Sprite;
  private soundButton: SoundButton | null = null;
  private muted = false;

  constructor() {
    super();

    lego.event
      .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this)
      .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getUIGridConfig();
  }

  public rebuild(config?: ICellConfig | undefined): void {
    super.rebuild(this.getGridConfig());
  }

  private build(): void {
    // this.initPctaButton();
    // this.initSoundButton();
  }

  private initPctaButton(): void {
    this.pcta = makeSprite(getPCtaSpriteConfig());
    this.pcta.eventMode = 'static';
    this.pcta.on('pointerdown', () => {
      lego.event.emit(CTAEvents.TakeToStore);
    });
    this.attach('pcta', this.pcta);
  }

  private initSoundButton(): void {
    this.soundButton = new SoundButton();
    this.attach('sound', this.soundButton);
  }

  private onSoundStateUpdate(soundState: SoundState): void {
    this.soundButton?.mutedUpdate(soundState === SoundState.Off);
  }

  private onGameStateUpdate(state: GameState): void {
    if (state === GameState.Win) {
      anime({
        targets: [this.soundButton, this.pcta],
        alpha: 0,
        duration: 100,
        easing: 'easeInOutSine',
      });
    }
  }
}
