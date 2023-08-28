import {customElement, property, state} from "lit/decorators.js";
import {css, html, TemplateResult} from "lit";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Map, View} from "ol";
import {TailwindElement} from "./tailwind.element.ts";
import {Layer} from "ol/layer";

import olStyles from 'ol/ol.css?inline';
import {getTailwindCustomColor} from "../utils/style-utils.ts";
import {Coordinate} from "openlayers";


@customElement("sandbox-map")
export class SandboxMap extends TailwindElement(olStyles) {

  private mapContainer: HTMLElement;
  private map: Map;
  private defaultZoom = 9;

  @state()
  private layers: Layer[] = [];
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
  }

  private _addMap() {
    this.renderRoot?.querySelector("#map-container")?.appendChild(this.mapContainer)
  }

  async firstUpdated() {
    this.map.setTarget(this.mapContainer);
    this.map.setLayers([...this.baseLayers, ...this.layers]);
    this.map.setView(new View({
      center: this.initialCenter,
      zoom: this.defaultZoom
    }));
    this._addMap();
  }

  addLayer(layer: Layer) {
    this.layers.push(layer);
    this.map.addLayer(layer);
  }

  getOlMap() {
    return this.map;
  }

  render(): TemplateResult {
    return html`
      <div id="map-container" class="w-full h-screen"></div>`
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
