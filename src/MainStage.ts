import { Container } from '@pixi/display';
import { PreloadView } from 'views/PreloadView';
import { BackgroundView } from './views/BackgroundView';
import { CTAView } from './views/CTAView';
import { ForegroundView } from './views/ForegroundView';
import { GameView } from './views/GameView';
import { UIView } from './views/UIView';

class PixiStage extends Container {
  private preloadView!: PreloadView;
  private bgView!: BackgroundView;
  private gameView!: GameView;
  private uiView!: UIView;
  private foregroundView!: ForegroundView;
  private ctaView!: CTAView;

  public resize(): void {
    this.preloadView?.rebuild();
    this.bgView?.rebuild();
    this.gameView?.rebuild();
    this.uiView?.rebuild();
    this.foregroundView?.rebuild();
    this.ctaView?.rebuild();
  }

  public updatePreloadProgress(percentage: number): void {
    this.preloadView?.updateProgress(percentage);
  }

  public showPreload(): void {
    this.preloadView = new PreloadView();
    this.addChild(this.preloadView);
  }

  public start(): void {
    this.preloadView?.destroy();

    this.bgView = new BackgroundView();
    this.addChild(this.bgView);
    this.gameView = new GameView();
    this.addChild(this.gameView);
    this.uiView = new UIView();
    this.addChild(this.uiView);
    this.foregroundView = new ForegroundView();
    this.addChild(this.foregroundView);
    this.ctaView = new CTAView();
    this.addChild(this.ctaView);
  }
}

export default PixiStage;
