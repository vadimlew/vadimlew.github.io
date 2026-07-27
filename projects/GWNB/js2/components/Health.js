import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Health extends Component {
  constructor(value = 100) {
    super(C.HEALTH);
    this.value = value;
  }
}
