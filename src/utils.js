function createEl(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.classList) el.classList.add(...options.classList);
    if (options.innerHTML) el.innerHTML = options.innerHTML;
    if (options.textContent) el.textContent = options.textContent;
    if (options.id) el.id = options.id;
    if (options.src) el.src = options.src;
    if (options.placeholder) el.placeholder = options.placeholder;
    if (options.style) Object.assign(el.style, options.style);
    if (options.onclick) el.onclick = options.onclick;
    if (options.attributes) {
        for (const [key, value] of Object.entries(options.attributes)) {
            el.setAttribute(key, value);
        }
    }
    if (options.children) {
        options.children.forEach(child => el.appendChild(child));
    }
    return el;
}
