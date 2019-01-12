import ResizeObserverEntry from './ResizeObserverEntry';

export default class ResizeObservation {

  public target: Element;
  public broadcastWidth: number = 0.0;
  public broadcastHeight: number = 0.0;

  constructor (target: Element) {
    this.target = target;
  }

  isActive() {
    const rect = new ResizeObserverEntry(this.target).contentRect;
    return this.broadcastWidth !== rect.width || this.broadcastHeight !== rect.height;
  }

}
