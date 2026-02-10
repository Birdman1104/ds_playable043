import { lego, legoLogger } from '@armathai/lego';
import { Application } from '@pixi/app';
import { Assets, checkDataUrl, checkExtension } from '@pixi/assets';
import { Spritesheet } from '@pixi/spritesheet';
import { SPINES_MANIFEST } from 'assetsInfo/spines';
import SoundController from 'components/SoundController';
import PixiStage from 'MainStage';
import Stats from 'stats.js';
import { ATLASES } from './assetsInfo/atlases';
import { IMAGES } from './assetsInfo/images';
import { SPRITESHEET } from './assetsInfo/spriteSheets';
import { ScreenSizeConfig } from './configs/ScreenSizeConfig';
import { mapCommands } from './lego/EventCommandPairs';
import { MainGameEvents, WindowEvent } from './lego/events/MainEvents';
import { fitDimension } from './utils/Utils';

class App extends Application {
  public stage: PixiStage = new PixiStage();

  public constructor() {
    super({
      backgroundColor: 0xe2e2e2,
      backgroundAlpha: 0,
      powerPreference: 'high-performance',
      antialias: true,
      resolution: Math.max(window.devicePixelRatio || 1, 2),
      sharedTicker: true,
    });
  }

  public async init(): Promise<void> {
    // @ts-ignore
    this.view.classList.add('app');
    // @ts-ignore
    document.body.appendChild(this.view);

    if (process.env.NODE_ENV !== 'production') {
      this.initStats();
      // this.initLego();
    }
    // await this.loadPreloadAssets();

    await this.loadAssets();
    this.appResize();
    // this.stage.showPreload();

    this.onLoadComplete();
  }

  public onFocusChange(focus: boolean): void {
    lego.event.emit(WindowEvent.FocusChange, focus);
    this.muteSound(!focus);
  }

  public onVisibilityChange(): void {
    this.muteSound(document.visibilityState !== 'visible');
  }

  public muteSound(value: boolean): void {
    lego.event.emit(MainGameEvents.MuteUpdate, value);
  }

  // private async loadPreloadAssets(): Promise<void> {
  //   const { name, img, json } = PRELOAD_ATLAS;

  //   const sheetTexture = await Assets.load({ alias: `${name}.png`, src: img });
  //   SPRITESHEET[name] = new Spritesheet(sheetTexture, json);
  //   await SPRITESHEET[name].parse();
  //   await Assets.load({ alias: PRELOAD_ATLAS.name, src: 'path' });
  // }

  private async loadAssets(): Promise<void> {
    SoundController.loadSounds();

    const totalFilesToLoad = IMAGES.length + ATLASES.length + SPINES_MANIFEST.length;
    let loadedFiles = 0;

    const onProgress = (): void => {
      loadedFiles += 1;
      this.stage.updatePreloadProgress(loadedFiles / totalFilesToLoad);
    };

    for (const image of IMAGES) {
      const { name, path } = image;
      await Assets.load({ alias: name, src: path }, () => onProgress());
    }

    for (const atlas of ATLASES) {
      const { name, json, img } = atlas;

      const sheetTexture = await Assets.load({ alias: `${name}.png`, src: img }, () =>
        onProgress(),
      );
      SPRITESHEET[name] = new Spritesheet(sheetTexture, json);
      await SPRITESHEET[name].parse();
    }

    Assets.add(SPINES_MANIFEST);

    //TODO: hack лоадер не работает с inline
    // @ts-ignore
    const spineTextureAtlasLoader = Assets.loader.parsers.find(
      (loader: any) => loader.extension?.name === 'spineTextureAtlasLoader',
    );

    if (spineTextureAtlasLoader) {
      spineTextureAtlasLoader.test = (url) => {
        return checkDataUrl(url, 'application/octet-stream') || checkExtension(url, '.atlas');
      };
      spineTextureAtlasLoader.testParse = (asset, options) => {
        const isExtensionRight =
          checkDataUrl(options?.src || '', 'application/octet-stream') ||
          checkExtension(options?.src || '', '.atlas');
        const isString = typeof asset === 'string';
        return Promise.resolve(isExtensionRight && isString);
      };
    }

    // const spineFiles = SPINES_MANIFEST.map((s) => s.alias);

    // for (const file of spineFiles) {
    //   await Assets.load(file, () => onProgress());
    // }
  }

  private onLoadComplete(): void {
    this.appResize();
    this.stage.start();
    lego.command.execute(mapCommands);
    lego.event.emit(MainGameEvents.MainViewReady);
  }

  public appResize(): void {
    const { clientWidth: w, clientHeight: h } = document.body;
    if (w === 0 || h === 0) return;

    const { min, max } = ScreenSizeConfig.size.ratio;
    const { width, height } = fitDimension({ width: w, height: h }, min, max);

    this.resizeCanvas(width, height);
    this.resizeRenderer(width, height);

    this.stage.resize();

    lego.event.emit(MainGameEvents.Resize);
  }

  private resizeCanvas(width: number, height: number): void {
    const { style } = this.renderer.view;
    if (!style) return;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }

  private resizeRenderer(width: number, height: number): void {
    this.renderer.resize(width, height);
  }

  private initLego(): void {
    legoLogger.start(lego, Object.freeze({}));
  }

  private initStats(): void {
    const stats = Stats();
    document.body.appendChild(stats.dom);
    stats.begin();
    this.ticker.add(() => {
      stats.update();
    });
  }
}

export default App;
