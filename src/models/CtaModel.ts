import { ObservableModel } from './ObservableModel';

export class CtaModel extends ObservableModel {
    private _visible: boolean;

    public constructor() {
        super('CtaModel');

        this._visible = false;
        this.makeObservable();
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    public destroy(): void {
        super.destroy();
    }

    public show(delay = 0): void {
        this._visible = true;
    }
}
