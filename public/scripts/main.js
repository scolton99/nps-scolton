const backgroundImage = parseInt(document.querySelector('meta[name="background-number"]').getAttribute('content'));
let last_search_time = null;
let pending_search = null;
const API_KEY = "vYkXNZMKQ0WWz7zGZNsC9qrLndwdy9xmfx0Sg2MF";
const API_ROOT = 'https://developer.nps.gov/api/v1';

preload([`/images/background/background-${backgroundImage}.jpg`], [() => {
    const background = document.getElementById("background-image");
    const img = background.firstElementChild;
    background.classList.add("loaded");
    img.src = `/images/background/background-${backgroundImage}.jpg`;
}]);

const api_req_string = (endpoint, args) => {
    const args_copy = JSON.parse(JSON.stringify(args));
    args_copy.api_key = API_KEY;

    const keys = Object.keys(args_copy);
    let argstr = "";
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = encodeURIComponent(args_copy[key]);

        argstr += `${key}=${value}`;
        if (i + 1 < keys.length)
            argstr += "&"
    }

    return `${API_ROOT}${endpoint}?${argstr}`
};

const search_suggestions_debounce = () => {
    show_loading_suggestions();
    window.clearTimeout(pending_search);
    pending_search = window.setTimeout(search_suggestions, 200);
};

const search_suggestions = () => {
    const query_text = document.getElementById("search").value;

    if (query_text === "") {
        clear_suggestions();
        return;
    }

    const request = api_req_string('/parks', {
        q: query_text,
        limit: 14,
        fields: 'images'
    });

    fetch(request).then(data => data.json()).then(data => {
        show_suggestions(data.data);
    });
};

const suggestions_empty = () => {
    const suggestions_dom = document.getElementById("suggestions");

    return !suggestions_dom.firstElementChild;
};

const show_loading_suggestions = () => {
    if (suggestions_empty())
        show_suggestions([{
            name: "Loading suggestions...",
            description: ""
        }])
};

const clear_suggestions = () => {
    const suggestions_dom = document.getElementById("suggestions");

    if (!suggestions_empty())
        suggestions_dom.removeChild(suggestions_dom.firstElementChild);
};

const show_suggestions = suggestions => {
    const suggestions_dom = document.getElementById("suggestions");
    const ul = document.createElement("ul");

    for (let suggestion of suggestions) {
        const li = document.createElement("li");
        const div = document.createElement("div");
        const img = new Image();
        console.log(suggestion);
        img.src = suggestion.images && suggestion.images.length !== 0 ? suggestion.images[0].url : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
        const h3 = document.createElement("h3");
        const p = document.createElement("p");

        h3.textContent = suggestion.name;
        p.textContent = suggestion.description;

        div.appendChild(h3);
        div.appendChild(p);
        li.appendChild(img);
        li.appendChild(div);
        ul.appendChild(li);
    }

    clear_suggestions();
    suggestions_dom.appendChild(ul);
};

const init = () => {
    document.getElementById("search").addEventListener("input", search_suggestions_debounce);
    document.getElementById("menu-button").addEventListener("click", toggle_nav);
    document.getElementById("nav-shade").addEventListener("click", toggle_nav);
};

const toggle_nav = () => {
    const nav = document.getElementById("side-panel");
    const shade = document.getElementById("nav-shade");

    if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        shade.classList.remove("open");
    } else {
        nav.classList.add("open");
        shade.classList.add("open");
    }
};

window.addEventListener("DOMContentLoaded", init);
