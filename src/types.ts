import { Emitter } from './KeyLayers';

export type ListenerOptions = {
  code?: number;
  codes?: number[];
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  skipInput?: boolean;
};

export type ListenerType = {
  callback: (e: KeyboardEvent) => void;
  options: ListenerOptions;
};

export type ListenersTarget = ListenersTargetItem[];

export type ListenersTargetItem = {
  id: string;
  instance: Emitter;
  onPress: (e: KeyboardEvent) => void;
  onDown: (e: KeyboardEvent) => void;
  onUp: (e: KeyboardEvent) => void;
};
