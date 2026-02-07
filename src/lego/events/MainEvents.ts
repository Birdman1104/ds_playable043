export const WindowEvent = Object.freeze({
  Resize: 'WindowEventResize',
  FocusChange: 'WindowEventFocusChange',
});

export const MainGameEvents = Object.freeze({
  Resize: 'MainGameEventsResize',
  MainViewReady: 'MainGameEventsMainViewReady',
  MuteUpdate: 'MainGameEventsMuteUpdate',
  AdToCTA: 'MainGameEventsAdToCTA',
  ParticleStart: 'MainGameEventsParticleStart',
});

export const UIEvents = Object.freeze({
  SoundButtonClick: 'UIEventsSoundButtonClick',
});

export const CTAEvents = Object.freeze({
  TakeToStore: 'CTAEventsTakeToStore',
});
