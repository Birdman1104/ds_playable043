import { lego } from '@armathai/lego';
import { hintParamGuard } from 'lego/guards/GameGuards';
import { AdStatus } from '../../models/AdModel';
import Head from '../../models/HeadModel';

export const initAdModelCommand = (): void => Head.initializeADModel();
export const showCtaCommand = (): void => Head.ad?.cta?.show();

export const startHintVisibilityTimerCommand = (): void =>
  Head.gameModel?.hintModel?.startVisibilityTimer();
export const stopHintVisibilityTimerCommand = (): void =>
  Head.gameModel?.hintModel?.stopVisibilityTimer();

export const hideHintCommand = (): void => {
  lego.command.payload(false).execute(setHintVisibleCommand);
};

export const setHintVisibleCommand = (value: boolean): void => {
  Head.gameModel?.hintModel?.setVisibility(value);
};

export const setAdToCTACommand = (): void => Head.ad?.setAdStatus(AdStatus.CTA);
const setAdStatusCommand = (status: AdStatus): void => Head.ad?.setAdStatus(status);
const initializeGameModelCommand = (): void => Head.initializeGameModel();
const initializeCtaModelCommand = (): void => Head.ad?.initializeCtaModel();
const initializeSoundModelCommand = (): void => Head.ad?.initializeSoundModel();
const initializeHintModelCommand = (): void => Head.gameModel?.initializeHintModel();

export const onMainViewReadyCommand = () => {
  lego.command
    //
    .execute(initAdModelCommand)

    .payload(AdStatus.Game)
    .execute(setAdStatusCommand);
};

export const initializeModelsCommand = (): void => {
  lego.command
    .execute(initializeGameModelCommand)
    .execute(initializeCtaModelCommand)
    .execute(initializeSoundModelCommand)
    .guard(hintParamGuard)
    .execute(initializeHintModelCommand);

  // TODO - add sound model initialization, hint initialization
};
