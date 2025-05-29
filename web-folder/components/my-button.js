class MyButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const button = document.createElement("button");
    button.textContent = "Click me";

    const style = document.createElement("style");
    style.textContent = `
      button {
        background: #007bff;
        color: white;
        padding: 0.5em 1em;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `;

    button.addEventListener("click", () => {
      alert("Button clicked!");
    });

    shadow.append(style, button);
  }
}

customElements.define("my-button", MyButton);
