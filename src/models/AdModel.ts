import { CtaModel } from './CtaModel';
import { ObservableModel } from './ObservableModel';
import { SoundModel } from './SoundModel';

export enum AdStatus {
  None = 'none',
  Game = 'game',
  PreCTA = 'pre_cta',
  CTA = 'cta',
}

export class AdModel extends ObservableModel {
  private _cta: CtaModel | null = null;
  private _sound: SoundModel | null = null;
  private _status = AdStatus.None;

  public constructor() {
    super('AdModel');
    this.makeObservable();
  }

  public set status(value: AdStatus) {
    this._status = value;
  }

  public get status(): AdStatus {
    return this._status;
  }

  public get cta(): CtaModel | null {
    return this._cta;
  }

  public set cta(value: CtaModel | null) {
    this._cta = value;
  }

  get sound(): SoundModel | null {
    return this._sound;
  }

  set sound(value: SoundModel | null) {
    this._sound = value;
  }

  public setAdStatus(status: AdStatus): void {
    this._status = status;
  }

  public init(): void {
    this.status = AdStatus.Game;
  }

  // CTA
  public initializeCtaModel(): void {
    this._cta = new CtaModel();
    this._cta.initialize();
  }

  public destroyCtaModel(): void {
    this._cta?.destroy();
    this._cta = null;
  }

  // SOUND;
  public initializeSoundModel(): void {
    this._sound = new SoundModel();
    this._sound.initialize();
  }

  public destroySoundModel(): void {
    this._sound?.destroy();
    this._sound = null;
  }
}
