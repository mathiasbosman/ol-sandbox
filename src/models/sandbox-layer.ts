import {Layer} from "ol/layer";

export class SandboxLayer {

  private readonly name: string;
  private readonly layer: Layer;

  constructor(name: string, olLayer: Layer) {
    this.name = name;
    this.layer = olLayer;
  }

  getName(): string {
    return this.name;
  }

  getLayer(): Layer {
    return this.layer;
  }

}
