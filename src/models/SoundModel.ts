import { ObservableModel } from './ObservableModel';

export enum SoundState {
  Unknown = 'Unknown',
  On = 'On',
  Off = 'Off',
}

export class SoundModel extends ObservableModel {
  private _state: SoundState;

  private initialSwitch = true;

  public constructor() {
    super('SoundModel');

    this._state = SoundState.Unknown;
    this.makeObservable();
  }

  get state(): SoundState {
    return this._state;
  }

  set state(value: SoundState) {
    this._state = value;
  }

  public turnOn(): void {
    if (this._state === SoundState.Off && this.initialSwitch) {
      this._state = SoundState.On;
      this.initialSwitch = false;
    }
  }

  public initialize(): void {
    this._state = SoundState.On;
  }

  public mute(): void {
    this._state = SoundState.Off;
  }

  public unmute(): void {
    this._state = SoundState.On;
  }

  public focusChange(focus: boolean): void {
    focus ? this.unmute() : this.mute();
  }

  public toggle(): void {
    this._state = this._state === SoundState.On ? SoundState.Off : SoundState.On;
  }
}
