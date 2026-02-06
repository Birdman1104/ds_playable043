import { lego } from '@armathai/lego';
import { SOUNDS } from 'assetsInfo/audio';
import { Howl } from 'howler';
import { MainGameEvents, SoundEvents } from 'lego/events/MainEvents';
import { SoundModelEvents } from 'lego/events/ModelEvents';
import { SoundState } from 'models/SoundModel';

const VOLUMES = {
  theme: 1.2,
  bell: 0.4,
};

const MAX_CONCURRENT_SOUNDS = 4;

class SoundControl {
  private sounds: { [key: string]: Howl };
  private isMutedFromIcon = false;
  private activePopSounds: Set<number> = new Set();
  private activeBellSounds: Set<number> = new Set();

  public constructor() {
    this.sounds = {};

    lego.event
      .on('muteSound', this.focusChange, this)
      .on(SoundEvents.Mute, this.mute, this)
      .on(SoundEvents.Unmute, this.unmute, this)
      .on(MainGameEvents.MuteUpdate, this.focusChange, this)
      .on(SoundEvents.Click, this.playClick, this)
      .on(SoundEvents.Theme, this.playTheme, this)
      .on(SoundEvents.Pop, this.playPop, this)
      .on(SoundEvents.Bell, this.playBell, this)
      .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this);
  }

  public loadSounds(): void {
    SOUNDS.forEach(({ name, path }) => {
      this.sounds[name] = new Howl({
        src: path,
        volume: VOLUMES[name as keyof typeof VOLUMES] ?? 1,
        loop: name === 'theme',
      });
    });
  }

  private playClick(): void {
    this.sounds.tap?.play();
  }

  private playTheme(): void {
    this.sounds.theme?.play();
  }

  private playBell(): void {
    const sound = this.sounds.bell;
    if (!sound) return;

    if (this.activeBellSounds.size >= MAX_CONCURRENT_SOUNDS) {
      return;
    }

    const soundId = sound.play();
    this.activeBellSounds.add(soundId);

    sound.on(
      'end',
      () => {
        this.activeBellSounds.delete(soundId);
      },
      soundId,
    );
  }

  private playPop(): void {
    const sound = this.sounds.pop;
    if (!sound) return;

    if (this.activePopSounds.size >= MAX_CONCURRENT_SOUNDS) {
      return;
    }

    const soundId = sound.play();
    this.activePopSounds.add(soundId);

    sound.on(
      'end',
      () => {
        this.activePopSounds.delete(soundId);
      },
      soundId,
    );
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
      value.volume(outOfFocus ? 0 : (VOLUMES[key as keyof typeof VOLUMES] ?? 1));
    }
  }
}

const SoundController = new SoundControl();
export default SoundController;
