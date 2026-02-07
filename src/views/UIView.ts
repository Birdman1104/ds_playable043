import { lego } from '@armathai/lego';
import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { Emitter } from '@pixi/particle-emitter';
import anime from 'animejs';
import { PixiGrid } from 'libs/grid';
import { getUIGridConfig } from '../configs/gridConfigs/UIViewGC';
import { PARTICLE_CONFIG } from '../configs/LootParticleConfig';
import { CtaModelEvents } from '../lego/events/ModelEvents';

const obj = {
  value: 0,
};
class Wrapper extends Container {
  private emitter1: Emitter | null = null;
  private emitter2: Emitter | null = null;

  private wrapper1: Container = new Container();
  private wrapper2: Container = new Container();

  constructor() {
    super();

    this.wrapper1.position.set(0, this.height * 0.8);
    this.wrapper2.position.set(this.width, this.height * 0.8);
    this.wrapper2.scale.set(-1, 1);

    this.addChild(this.wrapper1);
    this.addChild(this.wrapper2);
  }

  getBounds(): Rectangle {
    return new Rectangle(0, 0, 1500, 1500);
  }

  public update(delta: number): void {
    if (this.emitter1) {
      this.emitter1.update(delta);
    }
    if (this.emitter2) {
      this.emitter2.update(delta);
    }
  }

  public start(): void {
    let time = Date.now();

    const config = PARTICLE_CONFIG;
    const textureRandom = config.behaviors.find((b) => b.type === 'textureRandom');
    if (textureRandom) {
      textureRandom.config.textures = [
        Texture.from('particle_1.png'),
        Texture.from('particle_2.png'),
        Texture.from('particle_3.png'),
        Texture.from('particle_4.png'),
      ];
    }

    this.emitter1 = new Emitter(this.wrapper1, config);
    this.emitter2 = new Emitter(this.wrapper2, config);
    anime({
      targets: obj,
      value: 1,
      duration: 25000,
      easing: 'linear',
      update: () => {
        this.update((Date.now() - time) * 0.001);
        time = Date.now();
      },
    });
  }
}
export class UIView extends PixiGrid {
  private wrapper: Wrapper = new Wrapper();
  constructor() {
    super();

    lego.event.on(CtaModelEvents.VisibleUpdate, this.start, this);
    this.attach('wrapper', this.wrapper);
  }

  private start(visible: boolean): void {
    if (!visible) return;
    this.wrapper.start();
  }

  public getGridConfig(): ICellConfig {
    return getUIGridConfig();
  }

  public rebuild(config?: ICellConfig | undefined): void {
    super.rebuild(this.getGridConfig());
  }
}
