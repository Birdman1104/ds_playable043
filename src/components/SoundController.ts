import { lego } from '@armathai/lego';
import { SOUNDS } from 'assetsInfo/audio';
import { Howl } from 'howler';
import { MainGameEvents, SoundEvents } from 'lego/events/MainEvents';
import {
  GameModelEvents,
  SoundModelEvents
} from 'lego/events/ModelEvents';
import { GameState } from 'models/GameModel';
import { SoundState } from 'models/SoundModel';

const VOLUMES = {
  loot: 0.5,
};
class SoundControl {
  private sounds: { [key: string]: Howl };
  private isMutedFromIcon = false;

  private gameState = GameState.Unknown;

  public constructor() {
    this.sounds = {};

    lego.event
      .on(MainGameEvents.MuteUpdate, this.focusChange, this)
      .on(SoundEvents.Click, this.playClick, this)
      .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this)
      .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);
  }

  public loadSounds(): void {
    SOUNDS.forEach(({ name, path }) => {
      this.sounds[name] = new Howl({
        src: path,
        volume: VOLUMES[name as keyof typeof VOLUMES] ?? 1,
        loop: name === 'background',
      });
    });
  }

  private playClick(): void {
    this.sounds.click?.play();
  }

  private onGameStateUpdate(state: GameState): void {
    this.gameState = state;
    switch (state) {
      case GameState.Intro:
        this.sounds.background?.play();
        break;
      // case GameState.Win:
      //   this.sounds.background?.stop();
      //   this.sounds.win?.play();
      //   break;
      case GameState.Lose:
        this.sounds.background?.stop();
        this.sounds.lose?.play();
        break;

      default:
        break;
    }
    if (state === GameState.Intro) {
    }
  }

  private onSoundStateUpdate(state: SoundState): void {
    state === SoundState.On ? this.unmute() : this.mute();
  }

  private mute(): void {
    this.isMutedFromIcon = true;
    for (const [key, value] of Object.entries(this.sounds)) {
      value.volume(0);
    }
  }

  private unmute(): void {
    this.isMutedFromIcon = false;
    for (const [key, value] of Object.entries(this.sounds)) {
      value.volume(1);
    }
  }

  private focusChange(outOfFocus: boolean): void {
    if (this.isMutedFromIcon) return;
    for (const [key, value] of Object.entries(this.sounds)) {
      value.volume(outOfFocus ? 0 : VOLUMES[key as keyof typeof VOLUMES] ?? 1);
    }
  }
}

const SoundController = new SoundControl();
export default SoundController;
