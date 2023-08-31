import {customElement, property} from "lit/decorators.js";
import {css, html, TemplateResult} from "lit";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Map, View} from "ol";
import {TailwindElement} from "./tailwind.element.ts";
import {Layer} from "ol/layer";

import olStyles from 'ol/ol.css?inline';
import {getTailwindCustomColor} from "../utils/style-utils.ts";
import {Coordinate} from "openlayers";
import {SandboxLayer} from "../utils/geo-utils.ts";
import {LayerAddedEvent} from "./map-layer.element.ts";


export class LayersChangedEvent extends Event {
  readonly layers: SandboxLayer[];

  constructor(layers: SandboxLayer[]) {
    super('layers-changed', {bubbles: true});
    this.layers = layers;
  }
}

@customElement("sandbox-map")
export class SandboxMap extends TailwindElement(olStyles) {

  private readonly mapContainer: HTMLElement;
  private readonly map: Map;
  private defaultZoom = 9;

  @property() private layers: SandboxLayer[] = [];
  @property({type: Array})
  public baseLayers: Layer[] = [new TileLayer({
    className: 'grayscale',
    opacity: 0.6,
    source: new OSM({wrapX: false})
  })];
  @property()
  private initialCenter!:Coordinate;

  constructor() {
    super();
    this.map = new Map();
    this.mapContainer = document.createElement("div");
    this.mapContainer.style.width = "100%";
    this.mapContainer.style.height = "100%";
    this.map.setTarget(this.mapContainer);
  }

  async firstUpdated() {
    const olLayers = this.layers.map(l => l.layer);
    this.map.setLayers([...this.baseLayers, ...olLayers]);
    this.map.setView(new View({
      center: this.initialCenter,
      zoom: this.defaultZoom
    }));
    this.renderRoot?.querySelector("#map-container")?.appendChild(this.mapContainer)
  }

  addLayer(layer: SandboxLayer) {
    this.layers = [...this.layers, layer];
    this.map.addLayer(layer.layer);
    this.dispatchEvent(new LayersChangedEvent(this.layers));
  }

  private _handleLayerAdded(event: LayerAddedEvent): void {
    this.addLayer(event.layer);
  }

  getOlMap() {
    return this.map;
  }

  render(): TemplateResult {
    return html`
      <div id="map-container" @layer-added="${this._handleLayerAdded}">
        <slot></slot>
        <map-layer-panel .layers="${this.layers}"></map-layer-panel>
      </div>`
  }


  static styles = [
    ...super.styles,
    css`
        .ol-control button {
          background-color: ${getTailwindCustomColor("vl-science-blue")};
          color: ${getTailwindCustomColor("vl-white")};
          outline: none;
        }
        .ol-control button:hover, .ol-control button:focus {
          background-color: ${getTailwindCustomColor("vl-curious-blue")};
          color: ${getTailwindCustomColor("vl-white")};
          outline: none;
        }
      `
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'sandbox-map': SandboxMap
  }
}
