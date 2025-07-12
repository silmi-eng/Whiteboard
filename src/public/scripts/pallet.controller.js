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

    const erase = document.createElement('div');
    erase.classList.add('content_image');

    erase.addEventListener('click', (e) => {
      pallet.set.clear(e.target);
    });

    fragment.appendChild(erase);

    panel.appendChild(fragment);
    setTimeout(() => panel.style.bottom = "20px", 500);
  },
  set: {
    prev: null,
    next: (color, e) => {
      context.color = color;
      context.erase = false;

      const prev = pallet.set.prev;

      if (prev !== null) prev.style.borderColor = "#cdcdcd";

      e.style.borderColor = "#757575";

      pallet.set.prev = e;
    },
    clear: (e) => {
      context.color = null;
      context.erase = true;

      const prev = pallet.set.prev;

      if (prev !== null) prev.style.borderColor = "#cdcdcd";

      e.style.borderColor = "#757575";

      pallet.set.prev = e;
    }
  }
};
