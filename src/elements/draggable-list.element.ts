import {css, html, LitElement, TemplateResult} from "lit";
import {TailwindElement} from "./tailwind.element.ts";
import {customElement} from "lit/decorators.js";

let id = 0;
function uuid() {
  return new Date().getTime() + '' + id++;
}

@customElement("draggable-list")
class DraggableListElement extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('drop', this._drop);
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  private _drop(event) {
    event.target.classList.remove('over');
    const id = event.dataTransfer?.getData('text/plain');
    const draggable = this.querySelector(`[draggable-id="${id}"]`);
    if (!draggable) {
      throw Error("draggable element with id " + id + "not found");
    }
    console.log("dropping");
    console.log(draggable);
    console.log(event.target);
    this.renderRoot.insertBefore(draggable, event.target);
  }

  protected render(): TemplateResult {
    return html`<slot></slot>`
  }
}


@customElement("draggable-item")
export class DraggableItemElement extends TailwindElement("") {
  id = uuid();

  static styles = [
      super.styles,
    css`
      :host {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1rem;
      }

      :host(.over) {
        border: 1px solid red;
        border-radius: 5px;
        border-bottom: 4px solid red;
        transform: scale(1.1, 1.1);
      }

      :host(.draggable) {
        cursor: move;
        user-select: none;
      }

      .draggable-marker {
        font-size: 18px;
        font-weight: bold;
        cursor: move;
      }
      .draggable-content {
        flex: 1;
      }
    `
  ]

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dragstart', this.dragStart);
    this.addEventListener('dragenter', this.dragEnter);
    this.addEventListener('dragover', this.dragOver);
    this.addEventListener('dragleave', this.dragLeave);
    this.addEventListener('dragend', this.dragEnd);

    this.setAttribute('draggable-id', this.id);
    this.classList.add('draggable');
    this.setAttribute('draggable', 'true');
  }

  dragStart(event) {
    this.style.opacity = '0.4';
    if (!event.dataTransfer) {
      throw new Error("Event has no datatransfer available");
    }
    event.dataTransfer.setData('text/plain', this.id);
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('over');
    console.log("dragstart");
  }

  dragEnter(event) {
    event.preventDefault();
    event.target.classList.add('over');
    console.log('dragenter');
  }

  dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    console.log('dragover');
    return false;
  }

  dragLeave(event) {
    event.stopPropagation();
    event.target.classList.remove('over');
    console.log('dragleave');
  }

  dragEnd(event) {
    this.style.opacity = '1';
    event.target.classList.remove('over');
    console.log('dragend');
  }

  protected render(): unknown {
    return html`<div class="draggable-marker" draggable="true">::</div>
    <div class="draggable-content">
      <slot></slot>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'draggable-list': DraggableListElement;
    'draggable-item': DraggableItemElement;
  }
}
