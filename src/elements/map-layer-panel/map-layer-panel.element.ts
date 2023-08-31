import {TailwindElement} from "../tailwind.element.ts";
import {customElement, property, state} from "lit/decorators.js";
import {html, TemplateResult} from "lit";
import {repeat} from 'lit-html/directives/repeat.js';
import {SandboxLayer} from "../../utils/geo-utils.ts";


@customElement("map-layer-panel")
export class MapLayerPanelElement extends TailwindElement("") {

  @state()
  private isOpen = true;
  @property()
  layers: SandboxLayer[] = [];


  private _togglePanel():void {
    this.isOpen = !this.isOpen;
  }

  private _sortLayers(layers: SandboxLayer[]): SandboxLayer[] {
    let maxOrder = Math.max(...layers.map(layer => {return layer.order ?? 0}));
    // add missing orders
    layers.filter(layer => !layer.order).forEach(layer => layer.order = ++maxOrder);
    return layers.sort((layerA, layerB) => {
      return (layerA.order ?? 0) - (layerB.order ?? 0)
    });
  }

  private _renderLayer(sandboxLayer: SandboxLayer): TemplateResult {
    return html`
      <div class="p-4 border-b bg-white group">
        <div class="flex justify-between">
          <div class="flex-none w-10 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <div class="flex-auto">
            <p class="line-clamp-2">${sandboxLayer.description}</p>
            <div class="mt-1 text-xs text-zinc-500">Zoom in to view this layer</div>
          </div>
          <ul class="hidden group-hover:flex">
            <li class="border-l h-full flex items-center px-3">
              <button class="text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </li>
            <li class="border-l h-full flex items-center px-3">
              <button class="text-vl-curious-blue">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`<div id="layerpicker-wrapper" class="z-50 absolute right-0 top-0 h-screen items-end flex">
        <button
            @click="${this._togglePanel}"
            class="bottom-0 right-96 mx-3 my-5 p-2 aspect-square w-16 bg-white hover:bg-zinc-100 z-10 text-vl-curious-blue text-center shadow 
            focus:outline focus:outline-2 focus:outline-vl-outline focus:outline-offset-2 focus:shadow-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="mx-auto mb-0.5 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"/>
          </svg>
          <span class="text-vl-black-500 text-xs">Layers</span>
        </button>
        <div class="bg-zinc-100 h-screen w-[27rem] border-l ${!this.isOpen && "hidden"}">
          <h1 class="text-lg font-bold p-4 border-b bg-white">Layers</h1>
          <div class="p-4 border-b flex bg-white">
            <button
                class="text-sm hover:bg-vl-curious-blue rounded py-2 px-4 text-center text-vl-white font-bold w-full mx-1 bg-vl-science-blue">
              Add layer
            </button>
            <button
                class="text-sm bg-vl-white border-2 border-vl-curious-blue rounded py-2 px-4 text-center text-vl-curious-blue font-bold w-full mx-1">
              Via service
            </button>
          </div>
          ${repeat(this._sortLayers(this.layers), layer => {
            return this._renderLayer(layer)
          })}
        </div> <!-- end layer view -->
      </div>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "map-layer-panel": MapLayerPanelElement;
  }
}
