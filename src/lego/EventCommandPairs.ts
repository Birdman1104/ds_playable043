import { lego } from '@armathai/lego';
import {
  onAdStatusUpdateCommand,
  onSoundToggleCommand,
  takeToStoreCommand,
} from './commands/AdCommands';
import { onFirstClickCommand, onGameModelStateUpdateCommand } from './commands/GameCommands';
import { onMainViewReadyCommand, setAdToCTACommand } from './commands/MainCommands';
import { CTAEvents, MainGameEvents, SoundEvents, UIEvents } from './events/MainEvents';
import { AdModelEvents, GameModelEvents } from './events/ModelEvents';

export const mapCommands = () => {
  eventCommandPairs.forEach(({ event, command }) => {
    lego.event.on(event, command);
  });
};

export const unMapCommands = () => {
  eventCommandPairs.forEach(({ event, command }) => {
    lego.event.off(event, command);
  });
};

const eventCommandPairs = Object.freeze([
  {
    event: MainGameEvents.MainViewReady,
    command: onMainViewReadyCommand,
  },
  {
    event: AdModelEvents.StatusUpdate,
    command: onAdStatusUpdateCommand,
  },
  {
    event: GameModelEvents.StateUpdate,
    command: onGameModelStateUpdateCommand,
  },
  {
    event: CTAEvents.TakeToStore,
    command: takeToStoreCommand,
  },
  {
    event: UIEvents.SoundButtonClick,
    command: onSoundToggleCommand,
  },
  {
    event: SoundEvents.Click,
    command: onFirstClickCommand,
  },
  {
    event: MainGameEvents.AdToCTA,
    command: setAdToCTACommand,
  },
]);
