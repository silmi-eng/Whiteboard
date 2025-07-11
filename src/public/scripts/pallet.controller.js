const pallet = {
  invoke: (colors) => {
    const panel = document.getElementById("pallet");
    const fragment = document.createDocumentFragment();

    for (const c in colors) {
      const color = document.createElement("div");
      color.style.background = colors[c];
      color.addEventListener("click", (e) => {
        pallet.set.next(colors[c], e.target);
      });

      fragment.appendChild(color);
    }

    panel.appendChild(fragment);
    setTimeout(() => panel.style.bottom = "20px", 500);
  },
  set: {
    prev: null,
    next: (color, e) => {
      context.color = color;

      const prev = pallet.set.prev;

      if (prev !== null) prev.style.borderColor = "#cdcdcd";

      e.style.borderColor = "#757575";

      pallet.set.prev = e;
    },
  },
};
