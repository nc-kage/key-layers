import { Guid } from 'guid-typescript';
import { isArray, isUndefined, get, noop, last } from 'lodash';
import { ListenerOptions, ListenersTarget, ListenersTargetItem, ListenerType } from './types';

const ID = Guid.create().toString();
const RELEASE_DELAY = 150;

export const EMITTER_FORCE_LAYER_TYPE = `EMITTER_FORCE_LAYER_TYPE_${ID}`;
export const EMITTER_TOP_LAYER_TYPE = `EMITTER_TOP_LAYER_TYPE_${ID}`;

let isListenersSet = false;
const layersMap: Array<{ name: string; id: number }> = [];
const listenersLayers: ListenersTarget = [];
const listenersPredefinedLayers: {
  [key: number]: ListenersTarget;
} = {};
const forceListeners: ListenersTarget = [];

const onEvent = (e: KeyboardEvent, type: string) => {
  forceListeners.forEach((listener: ListenersTargetItem) => {
    get(listener, type, noop)(e);
  });
  if (listenersLayers.length) {
    get(last(listenersLayers), type, noop)(e);
  } else {
    const layers = Object.keys(listenersPredefinedLayers)
      .filter((key: string): boolean => listenersPredefinedLayers[Number(key)].length > 0)
      .sort((a: string, b: string): number => Number(a) - Number(b));
    (listenersPredefinedLayers[Number(last(layers))] || [])
      .forEach((listener: ListenersTargetItem) => {
        get(listener, type, noop)(e);
      });
  }
};

const clearTargetDownLists = (target: ListenersTarget) => {
  target.forEach((item: ListenersTargetItem) => {
    item.instance.clearDownList();
  });
};

const onPress = (e: KeyboardEvent) => {
  onEvent(e, 'onPress');
};
const onDown = (e: KeyboardEvent) => {
  onEvent(e, 'onDown');
};
const onUp = (e: KeyboardEvent) => {
  onEvent(e, 'onUp');
};
const onWindowBlur = () => {
  clearTargetDownLists(listenersLayers);
  clearTargetDownLists(forceListeners);
  Object.keys(listenersPredefinedLayers)
    .forEach((key: string) => clearTargetDownLists(listenersPredefinedLayers[Number(key)]));
};

export class Emitter {
  /**
   * @public
   *
   * Sets names for layers indexes.
   * @param {string|number|array[]|object[]|object} firstParam - Name or id of the layer.
   * For array or object it's a
   * layers config.
   *
   * @param {string} firstParam.name - Name of the layer.
   * @param {number} firstParam.id - Id of the layer.
   * @example
   * Emitter.setLayersMap({ name: 'fileBrowsing', id: 1 })
   *
   * @param {string} firstParam[0] - Name of the layer.
   * @param {number} firstParam[1] - Id of the layer.
   * @example
   * Emitter.setLayersMap(['fileBrowsing', 1])
   *
   * @param {number} firstParam[0] - Id of the layer.
   * @param {string} firstParam[1] - Name of the layer.
   * @example
   * Emitter.setLayersMap([1, 'fileBrowsing'])
   *
   * @param {string} firstParam[].name - Name of the layer.
   * @param {number} firstParam[].id - Id of the layer.
   * @example
   * Emitter.setLayersMap([
   *    { name: 'fileBrowsing', id: 1 },
   *    { name: 'preview', id: 5},
   * ])
   *
   * @param {string} firstParam[][0] - Name of the layer.
   * @param {number} firstParam[][1] - Id of the layer.
   * @example
   * Emitter.setLayersMap([
   *    ['fileBrowsing', 1],
   *    ['preview', 5],
   * ])
   *
   * @param {number} firstParam[][0] - Id of the layer.
   * @param {string} firstParam[][1] - Name of the layer.
   * @example
   * Emitter.setLayersMap([
   *    [1, 'fileBrowsing'],
   *    [5, 'preview'],
   * ])
   *
   * @param {Object.<string, number>} firstParam - Map of the Layers with name/id pairs.
   * @example
   * Emitter.setLayersMap({
   *    fileBrowsing: 1,
   *    preview: 5
   * })
   *
   * @param {string|number} secondParam - Name or id of the Layer.
   * @example
   * Emitter.setLayersMap('fileBrowsing', 1);
   * @example
   * Emitter.setLayersMap(1, 'fileBrowsing');
   *
   * @returns {number} Count of the set names;
   */
  public static setLayersMap(
    firstParam: string
      | number
      | { name: string, id: number }
      | Array<string | number>
      | Array<{ name: string, id: number }>
      | Array<Array<string | number>>
      | { [key: string]: number },
    secondParam?: number | string,
  ): number {
    if (typeof firstParam === 'string' && typeof secondParam === 'number') {
      return Number(Emitter.setLayerMap({ name: firstParam, id: secondParam }));
    }
    if (typeof firstParam === 'number' && typeof secondParam === 'string') {
      return Number(Emitter.setLayerMap({ name: secondParam, id: firstParam }));
    }
    if (isArray(firstParam) && firstParam.length === 2
      && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1] as number);
    }
    if (isArray(firstParam) && firstParam.length === 2
      && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1] as string);
    }
    if (isArray(firstParam) && isUndefined(secondParam)) {
      let setCount = 0;
      (firstParam as Array<{ name: string, id: number } | Array<string | number>>).forEach((
        layerMap: { name: string, id: number } | Array<string | number>,
      ) => {
        setCount += Number(Emitter.setLayerMap(layerMap));
      });
      return setCount;
    }
    if (!isArray(firstParam) && typeof firstParam === 'object'
      && !isUndefined(firstParam.name) && !isUndefined(firstParam.id)) {
      return Number(Emitter.setLayerMap(firstParam as { name: string; id: number }));
    }
    if (!isArray(firstParam) && typeof firstParam === 'object') {
      let setCount = 0;
      Object.keys(firstParam).forEach((key: string) => {
        const id = (firstParam as { [key: string]: number })[key];
        setCount += Number(Emitter.setLayerMap({ id, name: key }));
      });
      return setCount;
    }
    return 0;
  }

  private static setLayerMap(data: { name: string; id: number } | Array<string | number>): boolean {
    if (typeof data === 'object' && !isArray(data)) {
      return Emitter.setLayerMapFromObject(data);
    }
    if (isArray(data)) {
      return Emitter.setLayerMapFromArray(data);
    }
    return false;
  }

  private static setLayerMapFromObject(data: { name: string; id: number }): boolean {
    const { name, id } = data || { name: '', id: 0 };
    if (name) {
      layersMap.push({ name, id });
      return true;
    }
    return false;
  }

  private static setLayerMapFromArray(data: Array<string | number>): boolean {
    let name = data[0];
    let id = data[1];
    if (typeof name === 'number' && typeof id === 'string') {
      name = data[1];
      id = data[0];
    }
    return Emitter.setLayerMapFromObject({ name: name as string, id: id as number });
  }

  private static setGeneralListeners() {
    if (!isListenersSet) {
      window.addEventListener('keypress', onPress, true);
      window.addEventListener('keyup', onUp, true);
      window.addEventListener('keydown', onDown, true);
      window.addEventListener('blur', onWindowBlur, true);
      isListenersSet = true;
    }
  }

  private static getEventKeyCode(e: KeyboardEvent) {
    return e.which || e.keyCode;
  }

  private static checkInputTarget(e: KeyboardEvent) {
    return ['INPUT', 'TEXTAREA'].includes(get(e, 'target.tagName'));
  }

  private static checkMainOptions(
    e: KeyboardEvent,
    options: {
      altKey?: boolean;
      ctrlKey?: boolean;
      shiftKey?: boolean;
      metaKey?: boolean;
      skipInput?: boolean;
    },
  ) {
    const { altKey, ctrlKey, shiftKey, metaKey, skipInput } = options;
    const isInputTarget = Emitter.checkInputTarget(e);
    return (altKey ? e.altKey : true)
      && (ctrlKey ? e.ctrlKey : true)
      && (shiftKey ? e.shiftKey : true)
      && (metaKey ? e.metaKey : true)
      && !(isInputTarget && skipInput);
  }

  private static getListenersTarget(
    subscribeType: boolean | number | string,
  ): ListenersTarget | null {
    if (typeof subscribeType === 'number') {
      if (!listenersPredefinedLayers[subscribeType]) {
        listenersPredefinedLayers[subscribeType] = [];
      }
      return listenersPredefinedLayers[subscribeType];
    }
    if (subscribeType === EMITTER_FORCE_LAYER_TYPE) {
      return forceListeners;
    }
    if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
      return listenersLayers;
    }
    if (typeof subscribeType === 'string') {
      const layerId = get(layersMap.find(item => item.name === subscribeType), 'id');
      if (typeof layerId === 'number' && layerId >= 0) {
        return Emitter.getListenersTarget(layerId);
      }
    }
    return null;
  }

  private static clearDownLists(subscribeType: boolean | number | string) {
    if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
      Emitter.clearLayerDownLists();
      Emitter.clearPredefinedLayersDownLists();
    } else if ((subscribeType === 'string' && subscribeType !== EMITTER_FORCE_LAYER_TYPE)
      || typeof subscribeType === 'number') {
      const layerId = typeof subscribeType === 'string'
        ? get(layersMap.find(item => item.name === subscribeType), 'id')
        : subscribeType;
      const biggestLayerId = Math.max.apply(null, Object.keys(listenersPredefinedLayers)
        .map((key: string): number => Number(key)));
      if (layerId && layerId >= biggestLayerId) {
        Emitter.clearPredefinedLayersDownLists([layerId]);
      }
    }
  }

  private static clearLayerDownLists() {
    clearTargetDownLists(listenersLayers);
  }

  private static clearPredefinedLayersDownLists(skip: number[] = []) {
    Object.keys(listenersPredefinedLayers).forEach((key: string) => {
      const normalizedKey = Number(key);
      if (!skip.includes(normalizedKey)) {
        clearTargetDownLists(listenersPredefinedLayers[normalizedKey]);
      }
    });
  }

  private readonly subscribeType: boolean | number | string;
  private readonly releaseDelay: number;
  private readonly id: string = Guid.create().toString();
  private downList: Array<{
    timeStamp: number;
    keyCode: number;
    pressKeyCode?: number;
  }> = [];
  private releaseDictionary: { [key: string]: number } = {};
  private pressReleaseDictionary: {
    [key: number]: {
      timeStamp: number;
      keyCode: number;
      pressKeyCode?: number;
    };
  } = {};
  private keyDownListeners: ListenerType[] = [];
  private keyPressListeners: ListenerType[] = [];
  private keyUpListeners: ListenerType[] = [];
  private keyReleaseListeners: ListenerType[] = [];
  private pressReleaseListeners: ListenerType[] = [];

  /**
   * Constructor of the class.
   * @param {boolean|number|string} subscribeType - Layer type,
   * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
   * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
   * 5 - add to the layer with index 5.
   * @param {number} releaseDelay - Delay between keyDown and keyUp events for
   * fires keyRelease event.
   */
  constructor(subscribeType: boolean | number | string, releaseDelay: number = RELEASE_DELAY) {
    this.subscribeType = subscribeType || EMITTER_TOP_LAYER_TYPE;
    this.releaseDelay = releaseDelay;
    Emitter.setGeneralListeners();
    this.addListeners();
  }

  public clearDownList() {
    this.downList = [];
    this.releaseDictionary = {};
    this.pressReleaseDictionary = {};
  }

  public addListener(
    type: string, callback: (e: KeyboardEvent) => void, options: ListenerOptions = {},
  ) {
    switch (type) {
      case 'keyDown':
        this.keyDownListeners.push({ callback, options });
        break;

      case 'keyPress':
        this.keyPressListeners.push({ callback, options });
        break;

      case 'keyUp':
        this.keyUpListeners.push({ callback, options });
        break;

      case 'keyRelease':
        this.keyReleaseListeners.push({ callback, options });
        break;

      case 'pressRelease':
        this.pressReleaseListeners.push({ callback, options });
        break;
    }
    return () => this.removeListener(type, callback);
  }

  public removeListener(type: string, callback: (e: KeyboardEvent) => void) {
    let collection: ListenerType[] = [];
    switch (type) {
      case 'keyDown':
        collection = this.keyDownListeners;
        break;

      case 'keyPress':
        collection = this.keyPressListeners;
        break;

      case 'keyUp':
        collection = this.keyUpListeners;
        break;

      case 'keyRelease':
        collection = this.keyReleaseListeners;
        break;

      case 'pressRelease':
        collection = this.pressReleaseListeners;
        break;
    }
    for (let i = 0, ln = collection.length; i < ln; i += 1) {
      if (collection[i].callback === callback) {
        collection.splice(i, 1);
        break;
      }
    }
  }

  public destroy() {
    this.removeListeners();
  }

  private addListeners() {
    const { subscribeType } = this;
    const listenersTarget = Emitter.getListenersTarget(subscribeType);
    Emitter.clearDownLists(subscribeType);
    if (listenersTarget) {
      listenersTarget.push({
        id: this.id,
        instance: this,
        onPress: this.pressHandler,
        onDown: this.downHandler,
        onUp: this.upHandler,
      });
    } else {
      console.warn('KeyLayersJS', 'Unknown subscribe type!');
    }
  }

  private removeListeners() {
    const listenersTarget = Emitter.getListenersTarget(this.subscribeType);
    if (listenersTarget) {
      for (let i = 0, ln = listenersTarget.length; i < ln; i += 1) {
        if (listenersTarget[i].id === this.id) {
          listenersTarget.splice(i, 1);
          break;
        }
      }
    }
  }

  private pressHandler = (e: KeyboardEvent) => {
    const { downList } = this;
    const keyCode = Emitter.getEventKeyCode(e);
    const timeStamp = e.timeStamp;
    const downData = downList.find(item => item.timeStamp === timeStamp);
    if (downData) {
      downData.pressKeyCode = keyCode;
      this.keyPressListeners.forEach(listener => this.executeCallback(e, listener, true));
    }
  }

  private downHandler = (e: KeyboardEvent) => {
    const { downList } = this;
    const keyCode = Emitter.getEventKeyCode(e);
    if (!downList.find(item => item.keyCode === keyCode)) {
      downList.push({ keyCode, timeStamp: e.timeStamp });
    }
    this.keyDownListeners.forEach(listener => this.executeCallback(e, listener));
  }

  private upHandler = (e: KeyboardEvent) => {
    const { downList, releaseDictionary, pressReleaseDictionary, releaseDelay } = this;
    const keyCode = Emitter.getEventKeyCode(e);
    let keyDownInfo = null;
    for (let i = 0, ln = downList.length; i < ln; i += 1) {
      if (downList[i].keyCode === keyCode) {
        keyDownInfo = downList[i];
        downList.splice(i, 1);
        break;
      }
    }
    this.keyUpListeners.forEach(listener => this.executeCallback(e, listener));
    if (keyDownInfo && e.timeStamp - keyDownInfo.timeStamp <= releaseDelay) {
      releaseDictionary[keyDownInfo.keyCode] = keyDownInfo.timeStamp;
      this.keyReleaseListeners.forEach(listener => this.executeReleaseCallback(e, listener));
      if (keyDownInfo.pressKeyCode) {
        pressReleaseDictionary[keyDownInfo.keyCode] = keyDownInfo;
        this.pressReleaseListeners
          .forEach(listener => this.executeReleaseCallback(e, listener, true));
      }
    }
  }

  private executeCallback(
    e: KeyboardEvent,
    listener: ListenerType,
    isPressCheck: boolean = false,
  ) {
    const { callback, options } = listener;
    if (Emitter.checkMainOptions(e, options) && this.checkCodeOptions(e, options, isPressCheck)) {
      callback(e);
    }
  }

  private executeReleaseCallback(
    e: KeyboardEvent, listener: ListenerType, isPressCheck: boolean = false,
  ) {
    const { callback, options } = listener;
    if (Emitter.checkMainOptions(e, options)
      && this.checkReleaseCodeOptions(e, options, isPressCheck)) {
      callback(e);
    }
  }

  private checkCodeOptions(
    e: KeyboardEvent, options: ListenerOptions, isPressCheck: boolean = false,
  ) {
    const { code } = options;
    let { codes = [] } = options;
    const { downList } = this;
    const keyCode = Emitter.getEventKeyCode(e);
    codes = code && !codes.length ? [code] : codes;
    if (codes.length) {
      if (!codes.includes(keyCode)) {
        return  false;
      }
      for (let i = 0, ln = codes.length; i < ln; i += 1) {
        const checkCode = codes[i];
        if (checkCode !== keyCode && !downList.find(item => isPressCheck
          ? item.pressKeyCode === checkCode : item.keyCode === checkCode)) {
          return false;
        }
      }
    }
    return  true;
  }

  private checkReleaseCodeOptions(
    e: KeyboardEvent, options: ListenerOptions, isPressCheck: boolean = false,
  ) {
    const { code } = options;
    let { codes = [] } = options;
    const { releaseDictionary, pressReleaseDictionary, releaseDelay } = this;
    let keyCode = Emitter.getEventKeyCode(e);
    if (isPressCheck) {
      const keyPressInfo = pressReleaseDictionary[keyCode];
      if (e.timeStamp - keyPressInfo.timeStamp <= releaseDelay) {
        keyCode = keyPressInfo.pressKeyCode || 0;
      }
    }
    const timeStamp = e.timeStamp;
    codes = code && !codes.length ? [code] : codes;
    if (codes.length) {
      if (!codes.includes(keyCode)) {
        return  false;
      }
      for (let i = 0, ln = codes.length; i < ln; i += 1) {
        const checkCode = codes[i];
        let releaseCheckTimestamp = 0;
        if (isPressCheck) {
          const pressKey = Object.keys(pressReleaseDictionary).find((key: string): boolean => {
            return pressReleaseDictionary[Number(key)].pressKeyCode === checkCode;
          });
          releaseCheckTimestamp = pressKey ? pressReleaseDictionary[Number(pressKey)].timeStamp : 0;
        } else {
          releaseCheckTimestamp = releaseDictionary[checkCode];
        }
        if (checkCode !== keyCode && !(releaseCheckTimestamp
          && timeStamp - releaseCheckTimestamp <= releaseDelay)) {
          return false;
        }
      }
    }
    return  true;
  }
}
