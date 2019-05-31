var NPS;
(function (NPS) {
    var Util = /** @class */ (function () {
        function Util() {
        }
        Util.preload_images = function (paths, callbacks) {
            if (paths.length !== callbacks.length) {
                console.error('Images array and callbacks array must be of the same length');
                return;
            }
            for (var i = 0; i < paths.length; i++) {
                var img = new Image();
                img.src = paths[i];
                img.onload = callbacks[i];
                img.onerror = callbacks[i];
            }
        };
        return Util;
    }());
    NPS.Util = Util;
})(NPS || (NPS = {}));
var NPS;
(function (NPS) {
    var Suggestions = /** @class */ (function () {
        function Suggestions(domEl) {
            var _this = this;
            this.suggestions = null;
            this.update = function (suggestions) {
                _this.suggestions = suggestions;
                _this.render();
            };
            this.render = function () {
                _this.clear();
                if (_this.suggestions == null)
                    return;
                if (_this.suggestions.length == 0) {
                    var empty_suggestions = document.createElement("div");
                    empty_suggestions.classList.add("suggestions-empty");
                    empty_suggestions.textContent = "No results found.";
                    _this.element.appendChild(empty_suggestions);
                    return;
                }
                for (var _i = 0, _a = _this.suggestions; _i < _a.length; _i++) {
                    var suggestion = _a[_i];
                    var suggestion_div = document.createElement("div");
                    suggestion_div.classList.add("suggestion");
                    var h3 = document.createElement("h3");
                    var p = document.createElement("p");
                    h3.textContent = suggestion["name"];
                    p.textContent = suggestion["description"];
                    suggestion_div.appendChild(h3);
                    suggestion_div.appendChild(p);
                    _this.element.appendChild(suggestion_div);
                }
            };
            this.show_loading = function () {
                var first_child = _this.element.firstElementChild;
                if (first_child && first_child.classList.contains("suggestion-loading-container"))
                    return;
                _this.clear();
                var loading_div = document.createElement("div");
                loading_div.classList.add("suggestion-loading-container");
                var spinner = document.createElement("span");
                spinner.classList.add("spinner");
                loading_div.appendChild(spinner);
                _this.element.appendChild(loading_div);
            };
            this.clear = function () {
                while (_this.element.firstChild)
                    _this.element.removeChild(_this.element.firstChild);
            };
            this.empty = function () {
                return !_this.element.firstChild;
            };
            this.element = domEl;
        }
        return Suggestions;
    }());
    NPS.Suggestions = Suggestions;
})(NPS || (NPS = {}));
var API_KEY = "vYkXNZMKQ0WWz7zGZNsC9qrLndwdy9xmfx0Sg2MF";
var API_ROOT = 'https://developer.nps.gov/api/v1';
var NPS;
(function (NPS) {
    var APICall = /** @class */ (function () {
        function APICall(endpoint, args, callback, onerror, runnow) {
            var _this = this;
            if (runnow === void 0) { runnow = true; }
            this.execute = function () {
                var request = APICall.api_req_string('/parks', _this.args);
                fetch(request).then(function (data) { return data.json(); }).then(_this.callback).catch(_this.onerror);
            };
            this.endpoint = endpoint;
            this.args = args;
            this.callback = callback;
            this.onerror = onerror;
            console.log(runnow);
            if (runnow)
                this.execute();
        }
        APICall.api_req_string = function (endpoint, args) {
            var args_copy = JSON.parse(JSON.stringify(args));
            args_copy.api_key = API_KEY;
            var keys = Object.keys(args_copy);
            var arg_str = "";
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = encodeURIComponent(args_copy[key]);
                arg_str += key + "=" + value;
                if (i + 1 < keys.length)
                    arg_str += "&";
            }
            return "" + API_ROOT + endpoint + "?" + arg_str;
        };
        return APICall;
    }());
    NPS.APICall = APICall;
})(NPS || (NPS = {}));
/// <reference path="Util.ts" />
/// <reference path="Suggestions.ts" />
/// <reference path="APICall.ts" />
var NPS;
(function (NPS) {
    var DebouncedSearch = /** @class */ (function () {
        function DebouncedSearch(delay, suggestions) {
            var _this = this;
            this.timeout = null;
            //
            this.parse_search_text = function () {
                var query_text = document.getElementById("search").value;
                var res = /([^\s]*:[^\s]*)/g.exec(query_text);
                var search_text = query_text.replace(/([^\s]*:[^\s]*)/g, query_text);
                var arg_obj = {};
                for (var i = 1; i < res.length; i++) {
                    var _a = res[i].split(":"), key = _a[0], value = _a[1];
                    var parsed_value = value;
                    parsed_value = parsed_value.replace("_", " ");
                    arg_obj[key] = value;
                }
                return [search_text.trim(), arg_obj];
            };
            this.debounced_search = function () {
                var query_text = document.getElementById("search").value;
                if (query_text == "") {
                    document.body.classList.remove("searching");
                    _this.suggestions.clear();
                    return;
                }
                _this.last_search = query_text;
                _this.suggestions.show_loading();
                // let [text, obj] = this.parse_search_text();
                var args = {
                    q: query_text,
                    limit: 5,
                    fields: 'images'
                };
                new NPS.APICall('/parks', args, _this.fetch_complete.bind(_this, query_text));
            };
            this.fetch_complete = function (query, data) {
                if (query != _this.last_search)
                    return;
                _this.suggestions.update(data["data"]);
            };
            this.search = function () {
                if (_this.timeout != null)
                    window.clearTimeout(_this.timeout);
                document.body.classList.add("searching");
                if (_this.suggestions.empty())
                    _this.suggestions.show_loading();
                _this.timeout = window.setTimeout(_this.debounced_search, _this.delay);
            };
            this.delay = delay;
            this.suggestions = suggestions;
        }
        return DebouncedSearch;
    }());
    NPS.DebouncedSearch = DebouncedSearch;
})(NPS || (NPS = {}));
var NPS;
(function (NPS) {
    var Drawer = /** @class */ (function () {
        function Drawer(domEl, shade) {
            var _this = this;
            this.toggle = function () {
                if (_this.element.classList.contains("open")) {
                    _this.element.classList.remove("open");
                    _this.shade.classList.remove("open");
                }
                else {
                    _this.element.classList.add("open");
                    _this.shade.classList.add("open");
                }
            };
            this.set_toggle = function (element) {
                element.addEventListener("click", _this.toggle);
            };
            this.element = domEl;
            this.shade = shade;
        }
        ;
        return Drawer;
    }());
    NPS.Drawer = Drawer;
})(NPS || (NPS = {}));
/// <reference path="Util.ts" />
var NPS;
(function (NPS) {
    var Background = /** @class */ (function () {
        function Background(container, image) {
            var _this = this;
            this.show_background = function () {
                _this.container.classList.add("loaded");
                _this.image.src = "/images/background/background-" + _this.background_number + ".jpg";
            };
            this.container = container;
            this.image = image;
            this.background_number = Background.get_background_number();
            NPS.Util.preload_images([
                "/images/background/background-" + this.background_number + ".jpg"
            ], [
                this.show_background
            ]);
        }
        Background.get_background_number = function () {
            var background_number_meta_tag = document.querySelector('meta[name="background-number"]');
            return parseInt(background_number_meta_tag.getAttribute('content'));
        };
        return Background;
    }());
    NPS.Background = Background;
})(NPS || (NPS = {}));
/// <reference path="Util.ts" />
/// <reference path="Suggestions.ts" />
/// <reference path="DebouncedSearch.ts" />
/// <reference path="Drawer.ts" />
/// <reference path="Background.ts" />
/// <reference path="Dependencies.ts" />
var NPS;
(function (NPS) {
    var Application = /** @class */ (function () {
        function Application() {
            var _this = this;
            this.page_name = null;
            this.page_elements = {};
            this.setup_page_name = function () {
                var page_name_meta_tag = document.querySelector('meta[name="page-name"]');
                _this.page_name = page_name_meta_tag.getAttribute('content');
            };
            this.pre_init = function () {
                _this.setup_page_name();
                switch (_this.page_name) {
                    case "homepage": {
                        // Perform all the JS setup specific to the homepage
                        _this.page_elements.suggestions = new NPS.Suggestions(document.getElementById("suggestions"));
                        _this.page_elements.debounced_search = new NPS.DebouncedSearch(200, _this.page_elements.suggestions);
                        var drawer_dom = document.getElementById("side-panel");
                        var shade_dom = document.getElementById("nav-shade");
                        _this.page_elements.drawer = new NPS.Drawer(drawer_dom, shade_dom);
                        var _a = _this.page_elements, drawer = _a.drawer, debounced_search = _a.debounced_search;
                        var search = document.getElementById("search");
                        if (search)
                            search.addEventListener("input", debounced_search.search);
                        drawer.set_toggle(document.getElementById("menu-button"));
                        drawer.set_toggle(document.getElementById("nav-shade"));
                        var background_container = document.getElementById("background-image");
                        var background_image = background_container.firstElementChild;
                        _this.page_elements.background = new NPS.Background(background_container, background_image);
                        break;
                    }
                    case "park": {
                        break;
                    }
                }
            };
            this.init = function () {
            };
            this.addGlobalListeners = function () {
                window.addEventListener("DOMContentLoaded", _this.pre_init);
                window.addEventListener("load", _this.init);
            };
            this.addGlobalListeners();
        }
        return Application;
    }());
    NPS.Application = Application;
})(NPS || (NPS = {}));
app = new NPS.Application();
//# sourceMappingURL=application.js.map