import { lego } from '@armathai/lego';
import { SOUNDS } from 'assetsInfo/audio';
import { Howl } from 'howler';
import { MainGameEvents } from 'lego/events/MainEvents';
import { CtaModelEvents, SoundModelEvents } from 'lego/events/ModelEvents';
import { SoundState } from 'models/SoundModel';

const VOLUMES = {
  theme: 1,
};

export const SoundEvents = Object.freeze({
  Mute: 'SoundEventsMute',
  Unmute: 'SoundEventsUnmute',

  Click: 'SoundEventsClick',
  GemClick: 'SoundEventsGemClick',
  StackClick: 'SoundEventsStackClick',
  EmptyClick: 'SoundEventsEmptyClick',
  Theme: 'SoundEventsTheme',
  Text: 'SoundEventsText',

  Zoom: 'SoundEventsZoom',

  Pop: 'SoundEventsPop',
});
class SoundControl {
  private sounds: { [key: string]: Howl };
  private isMutedFromIcon = false;

  public constructor() {
    this.sounds = {};

    lego.event
      .on('muteSound', this.focusChange, this)
      .on(SoundEvents.Mute, this.mute, this)
      .on(SoundEvents.Unmute, this.unmute, this)
      .on(MainGameEvents.MuteUpdate, this.focusChange, this)
      .on(CtaModelEvents.VisibleUpdate, this.playWin, this)
      .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this)

      .on(SoundEvents.Click, this.playClick, this)
      .on(SoundEvents.GemClick, this.playGemClick, this)
      .on(SoundEvents.StackClick, this.playStackClick, this)
      .on(SoundEvents.Theme, this.playTheme, this)
      .on(SoundEvents.Text, this.playText, this)
      .on(SoundEvents.EmptyClick, this.playEmptyClick, this)
      .on(SoundEvents.Zoom, this.playZoom, this);
  }

  private playZoom(): void {
    this.sounds.zoom?.play();
  }

  private playClick(): void {
    this.playTheme();
    this.sounds.tap?.play();
  }

  private playTheme(): void {
    if (!this.sounds.theme?.playing()) {
      this.sounds.theme?.play();
    }
  }

  private playText(): void {
    this.sounds.textAudio?.play();
  }

  private playGemClick(): void {
    this.sounds.gemClick?.play();
  }

  private playStackClick(): void {
    this.sounds.stackClick?.play();
  }

  private playEmptyClick(): void {
    this.sounds.emptyClick?.play();
  }

  private playWin(): void {
    this.sounds.theme?.stop();
    this.sounds.win?.play();
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
      value.volume(VOLUMES[key as keyof typeof VOLUMES] ?? 1);
    }
  }

  private focusChange(outOfFocus: boolean): void {
    if (this.isMutedFromIcon) return;
    for (const [key, value] of Object.entries(this.sounds)) {
      value.volume(outOfFocus ? 0 : (VOLUMES[key as keyof typeof VOLUMES] ?? 1));
    }
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
}

const SoundController = new SoundControl();
export default SoundController;
