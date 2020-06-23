import { ListenerOptions, EventType } from './types';

export default interface IEmitter {
  clearDownList(): void;
  addListener(
    type: EventType, callback: (e: KeyboardEvent) => void, options: ListenerOptions,
  ): void;
  removeListener(type: EventType, callback: (e: KeyboardEvent) => void): void;
  destroy(): void;
  updateLayerType(subscribeType: boolean | number | string): void;
}
