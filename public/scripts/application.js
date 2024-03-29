var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
            this.params = {};
            this.update = function (suggestions, params) {
                _this.suggestions = suggestions;
                _this.params = params;
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
                console.log(_this.params);
                var _loop_1 = function (suggestion) {
                    var failed = false;
                    for (var _b = 0, _c = Object.keys(_this.params); _b < _c.length; _b++) {
                        var key = _c[_b];
                        if (typeof (_this.params[key]) === "undefined")
                            continue;
                        if (!suggestion[key]) {
                            failed = true;
                            break;
                        }
                        console.log(suggestion);
                        console.log(_this.params);
                        console.log(key);
                        if (suggestion[key].toLowerCase() !== _this.params[key].toLowerCase()) {
                            failed = true;
                            break;
                        }
                    }
                    if (failed)
                        return "continue";
                    var suggestion_div = document.createElement("div");
                    suggestion_div.classList.add("suggestion");
                    var h3 = document.createElement("h3");
                    var p = document.createElement("p");
                    h3.textContent = suggestion["name"];
                    p.textContent = suggestion["description"];
                    suggestion_div.appendChild(h3);
                    suggestion_div.appendChild(p);
                    suggestion_div.addEventListener("click", function () {
                        window.location.href = "/park/" + suggestion["parkCode"];
                    });
                    _this.element.appendChild(suggestion_div);
                };
                for (var _i = 0, _a = _this.suggestions; _i < _a.length; _i++) {
                    var suggestion = _a[_i];
                    _loop_1(suggestion);
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
            if (onerror === void 0) { onerror = function (data) { console.error(data); }; }
            if (runnow === void 0) { runnow = true; }
            this.execute = function () {
                var request = APICall.api_req_string(_this.endpoint, _this.args);
                fetch(request).then(function (data) { return data.json(); }).then(_this.callback).catch(_this.onerror);
            };
            this.endpoint = endpoint;
            this.args = args;
            this.callback = callback;
            this.onerror = onerror;
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
                arg_str += "".concat(key, "=").concat(value);
                if (i + 1 < keys.length)
                    arg_str += "&";
            }
            return "".concat(API_ROOT).concat(endpoint, "?").concat(arg_str);
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
                var search_text = query_text.replace(/([^\s]*:[^\s]*)/g, "");
                if (res == null)
                    return [search_text.trim(), {}];
                var arg_obj = {};
                for (var i = 1; i < res.length; i++) {
                    var _a = res[i].split(":"), key = _a[0], value = _a[1];
                    var parsed_value = value;
                    parsed_value = parsed_value.replace(/_/g, " ");
                    arg_obj[key] = parsed_value;
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
                var _a = _this.parse_search_text(), text = _a[0], obj = _a[1];
                var args = {
                    q: text,
                    limit: 25,
                    fields: 'images'
                };
                if (obj.stateCode) {
                    args["stateCode"] = obj.stateCode;
                    obj.stateCode = void (0);
                }
                new NPS.APICall('/parks', args, _this.fetch_complete.bind(_this, query_text, obj));
            };
            this.fetch_complete = function (query, params, data) {
                if (query != _this.last_search)
                    return;
                _this.suggestions.update(data["data"], params);
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
                _this.image.src = "/images/background/background-".concat(_this.background_number, ".jpg");
            };
            this.container = container;
            this.image = image;
            this.background_number = Background.get_background_number();
            NPS.Util.preload_images([
                "/images/background/background-".concat(this.background_number, ".jpg")
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
var NPS;
(function (NPS) {
    var PageComponent = /** @class */ (function () {
        function PageComponent(data, container) {
            this.data = data;
            this.container = container;
        }
        PageComponent.prototype.clear = function () {
            while (this.container.firstChild)
                this.container.removeChild(this.container.firstChild);
        };
        PageComponent.prototype.hide = function () {
            this.container.classList.add("hidden");
        };
        PageComponent.prototype.showLoading = function () {
            this.clear();
            var loading_container = document.createElement("div");
            loading_container.classList.add("loading-container");
            var spinner = document.createElement("span");
            spinner.classList.add("spinner");
            spinner.classList.add("dark");
            loading_container.appendChild(spinner);
            this.container.appendChild(loading_container);
        };
        return PageComponent;
    }());
    NPS.PageComponent = PageComponent;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var ParkInfo = /** @class */ (function (_super) {
        __extends(ParkInfo, _super);
        function ParkInfo(data, container) {
            var _this = _super.call(this, data, container) || this;
            // Business logic for rendering park info goes here
            _this.render = function () {
                // Get a clean slate for rendering
                _this.clear();
                var _a = _this.data[0], name = _a.fullName, lat_long_raw = _a.latLong, description = _a.description, _b = _a.images[0], img_src = _b.url, img_alt = _b.altText, img_caption = _b.caption, img_credit = _b.credit, weather_info = _a.weatherInfo, directions_url = _a.directionsUrl;
                var header = document.createElement("header");
                var heading = document.createElement("h1");
                heading.textContent = name;
                header.appendChild(heading);
                _this.container.appendChild(header);
                var image_container = document.createElement("section");
                image_container.classList.add("image");
                image_container.style.background = "url(".concat(img_src, ")");
                image_container.style.backgroundSize = "cover";
                image_container.title = img_alt;
                var image_caption = document.createElement("div");
                image_caption.innerHTML = img_caption + "<br><br>Credit: " + img_credit;
                image_container.appendChild(image_caption);
                _this.container.appendChild(image_container);
                var desc_map = document.createElement("section");
                desc_map.classList.add("desc-map");
                var map = document.createElement("iframe");
                var lat_long_arr = lat_long_raw.split(",");
                var lat_long = {
                    lat: lat_long_arr[0].split(":")[1].trim(),
                    long: lat_long_arr[1].split(":")[1].trim()
                };
                var lat = lat_long.lat, long = lat_long.long;
                var map_src = "https://www.google.com/maps/embed/v1/view?key=AIzaSyB-M5tJXFIL2ANThjOaCNcYl2DyJsPastI";
                map_src += "&center=".concat(lat, ",").concat(long);
                map_src += "&zoom=10";
                map.src = map_src;
                map.setAttribute("frameborder", "0");
                map.style.border = "none";
                map.width = "250";
                map.height = "250";
                var desc = document.createElement("div");
                desc.textContent = description;
                desc_map.appendChild(desc);
                desc_map.appendChild(map);
                _this.container.appendChild(desc_map);
                var footer = document.createElement("footer");
                _this.container.appendChild(footer);
                var weather = document.createElement("a");
                weather.href = weather_info;
                weather.textContent = "Get Weather";
                var directions = document.createElement("a");
                directions.href = directions_url;
                directions.textContent = "Get Directions";
                footer.appendChild(weather);
                footer.appendChild(directions);
                _this.container.appendChild(footer);
            };
            _this.render();
            return _this;
        }
        return ParkInfo;
    }(NPS.PageComponent));
    NPS.ParkInfo = ParkInfo;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var Places = /** @class */ (function (_super) {
        __extends(Places, _super);
        function Places(data, container) {
            var _this = _super.call(this, data, container) || this;
            _this.render = function () {
                // Get a clean slate for rendering
                while (_this.container.firstChild)
                    _this.container.removeChild(_this.container.firstChild);
            };
            _this.render();
            return _this;
        }
        return Places;
    }(NPS.PageComponent));
    NPS.Places = Places;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var LessonPlans = /** @class */ (function (_super) {
        __extends(LessonPlans, _super);
        function LessonPlans(data, container) {
            var _this = _super.call(this, data, container) || this;
            _this.render = function () {
                _this.clear();
                var header = document.createElement("header");
                var heading = document.createElement("h1");
                heading.textContent = "Lesson Plans";
                header.appendChild(heading);
                _this.container.appendChild(header);
                for (var _i = 0, _a = _this.data; _i < _a.length; _i++) {
                    var lesson_plan = _a[_i];
                    var lesson_title = lesson_plan.title, lesson_url = lesson_plan.url, lesson_duration = lesson_plan.duration, lesson_objective = lesson_plan.questionobjective, lesson_subject = lesson_plan.subject;
                    var title = document.createElement("h4");
                    var title_a = document.createElement("a");
                    title_a.textContent = lesson_title;
                    title_a.href = lesson_url;
                    title.appendChild(title_a);
                    _this.container.appendChild(title);
                    var duration = document.createElement("div");
                    duration.textContent = lesson_duration + ", " + lesson_subject.replace(/,/g, ", ");
                    duration.classList.add("duration");
                    _this.container.appendChild(duration);
                    var obj = document.createElement("div");
                    obj.classList.add("objective");
                    obj.innerHTML = lesson_objective.replace(/;\s*/g, "<br>");
                    _this.container.appendChild(obj);
                }
            };
            _this.render();
            return _this;
        }
        return LessonPlans;
    }(NPS.PageComponent));
    NPS.LessonPlans = LessonPlans;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var NewsReleases = /** @class */ (function (_super) {
        __extends(NewsReleases, _super);
        function NewsReleases(data, container) {
            var _this = _super.call(this, data, container) || this;
            _this.render = function () {
                _this.clear();
                var header = document.createElement("header");
                var heading = document.createElement("h1");
                heading.textContent = "News Releases";
                header.appendChild(heading);
                _this.container.appendChild(header);
                for (var _i = 0, _a = _this.data; _i < _a.length; _i++) {
                    var news_release = _a[_i];
                    var _b = news_release.image, image_alt = _b.altText, image_url = _b.url, image_credit = _b.credit, news_release_title = news_release.title, news_release_url = news_release.url, news_release_date = news_release.releasedate, news_release_abstract = news_release.abstract;
                    var display = document.createElement("div");
                    display.classList.add("news-release-display");
                    var preview_image = document.createElement("img");
                    if (image_credit !== "") {
                        preview_image.alt = image_alt;
                        preview_image.src = image_url;
                    }
                    else {
                        preview_image.alt = "No image";
                        preview_image.src = "/images/placeholder.jpg";
                    }
                    display.appendChild(preview_image);
                    var title_abstract = document.createElement("div");
                    title_abstract.classList.add("title-abstract");
                    var title = document.createElement("h4");
                    title.classList.add("title");
                    var title_a = document.createElement("a");
                    title_a.href = news_release_url;
                    title_a.textContent = news_release_title;
                    title.appendChild(title_a);
                    var date = document.createElement("div");
                    date.classList.add("date");
                    var date_parts = news_release_date.replace(/\.0/g, "").split(" ")[0].split("-");
                    var year = parseInt(date_parts[0]);
                    var month = parseInt(date_parts[1]) - 1;
                    var day = parseInt(date_parts[2]);
                    date.textContent = NewsReleases.formatDate(new Date(year, month, day));
                    var abstract = document.createElement("div");
                    abstract.classList.add("abstract");
                    abstract.textContent = news_release_abstract;
                    title_abstract.appendChild(title);
                    title_abstract.appendChild(date);
                    title_abstract.appendChild(abstract);
                    display.appendChild(title_abstract);
                    _this.container.appendChild(display);
                }
            };
            _this.render();
            return _this;
        }
        NewsReleases.formatDate = function (date) {
            var year = date.getFullYear();
            var month_num = date.getMonth();
            var month;
            switch (month_num) {
                case 0: {
                    month = "January";
                    break;
                }
                case 1: {
                    month = "February";
                    break;
                }
                case 2: {
                    month = "March";
                    break;
                }
                case 3: {
                    month = "April";
                    break;
                }
                case 4: {
                    month = "May";
                    break;
                }
                case 5: {
                    month = "June";
                    break;
                }
                case 6: {
                    month = "July";
                    break;
                }
                case 7: {
                    month = "August";
                    break;
                }
                case 8: {
                    month = "September";
                    break;
                }
                case 9: {
                    month = "October";
                    break;
                }
                case 10: {
                    month = "November";
                    break;
                }
                case 11: {
                    month = "December";
                    break;
                }
                default: {
                    month = null;
                }
            }
            var day = date.getDate();
            return "".concat(month, " ").concat(day, ", ").concat(year);
        };
        return NewsReleases;
    }(NPS.PageComponent));
    NPS.NewsReleases = NewsReleases;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var Articles = /** @class */ (function (_super) {
        __extends(Articles, _super);
        function Articles(data, container) {
            var _this = _super.call(this, data, container) || this;
            _this.render = function () {
                _this.clear();
                var header = document.createElement("header");
                var heading = document.createElement("h1");
                heading.textContent = "Articles";
                header.appendChild(heading);
                _this.container.appendChild(header);
                for (var _i = 0, _a = _this.data; _i < _a.length; _i++) {
                    var article = _a[_i];
                    var article_desc = article.listingdescription, _b = article.listingimage, image_alt = _b.altText, image_url = _b.url, article_title = article.title, article_url = article.url;
                    var article_display = document.createElement("div");
                    article_display.classList.add("article-display");
                    var image = document.createElement("img");
                    image.src = image_url;
                    image.alt = image_alt;
                    article_display.appendChild(image);
                    var title_description = document.createElement("div");
                    title_description.classList.add("title-description");
                    var title_a = document.createElement("a");
                    title_a.target = "_blank";
                    title_a.href = article_url;
                    title_a.textContent = article_title;
                    var title = document.createElement("h4");
                    title.appendChild(title_a);
                    var description = document.createElement("div");
                    description.textContent = article_desc;
                    title_description.appendChild(title);
                    title_description.appendChild(description);
                    article_display.appendChild(title_description);
                    _this.container.appendChild(article_display);
                }
            };
            _this.render();
            return _this;
        }
        return Articles;
    }(NPS.PageComponent));
    NPS.Articles = Articles;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var Events = /** @class */ (function (_super) {
        __extends(Events, _super);
        function Events(data, container) {
            var _this = _super.call(this, data, container) || this;
            _this.back = function () {
                if (_this.month == 0) {
                    _this.month = 11;
                    _this.year--;
                }
                else {
                    _this.month--;
                }
                _this.render();
            };
            _this.forward = function () {
                if (_this.month == 11) {
                    _this.month = 0;
                    _this.year++;
                }
                else {
                    _this.month++;
                }
                _this.render();
            };
            _this.render = function () {
                _this.clear();
                var header = document.createElement("header");
                var heading = document.createElement("h1");
                heading.textContent = "Events";
                header.appendChild(heading);
                _this.container.appendChild(header);
                var iter = Events.days_in_month(_this.month, _this.year);
                for (var i = 0; i < iter; i++) {
                    var display_date = i + 1;
                }
                var events = _this.data.filter((function (item) {
                    return item.dates.map(function (date) { return parseInt(date.split("-")[1]) - 1; }).includes(_this.month);
                }).bind(_this));
            };
            var date = new Date();
            _this.year = date.getFullYear();
            _this.month = date.getMonth();
            _this.render();
            return _this;
        }
        Events.leap_year = function (year) {
            return (year % 4 == 0) && ((year % 100 !== 0) || (year % 400 == 0));
        };
        Events.days_in_month = function (month, year) {
            switch (month) {
                case 1: {
                    if (Events.leap_year(year)) {
                        return 29;
                    }
                    else {
                        return 28;
                    }
                }
                case 8:
                case 3:
                case 5:
                case 10: {
                    return 30;
                }
                case 0:
                case 2:
                case 4:
                case 6:
                case 7:
                case 9:
                case 11: {
                    return 31;
                }
                default: {
                    return -1;
                }
            }
        };
        return Events;
    }(NPS.PageComponent));
    NPS.Events = Events;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var Alerts = /** @class */ (function (_super) {
        __extends(Alerts, _super);
        function Alerts(data, container) {
            var _this = _super.call(this, data, container) || this;
            _this.render = function () {
                _this.clear();
                var header = document.createElement("header");
                var heading = document.createElement("h1");
                heading.textContent = "Alerts";
                header.appendChild(heading);
                _this.container.appendChild(header);
                for (var _i = 0, _a = _this.data; _i < _a.length; _i++) {
                    var alert_1 = _a[_i];
                    var alert_abstract = alert_1.abstract, alert_title = alert_1.title, alert_url = alert_1.url;
                    var title = document.createElement("h4");
                    var title_a = document.createElement("a");
                    title_a.textContent = alert_title;
                    title_a.href = alert_url;
                    title_a.target = "_blank";
                    title.appendChild(title_a);
                    title.classList.add("alert-display");
                    _this.container.appendChild(title);
                }
            };
            _this.render();
            return _this;
        }
        return Alerts;
    }(NPS.PageComponent));
    NPS.Alerts = Alerts;
})(NPS || (NPS = {}));
/// <reference path="PageComponent.ts" />
var NPS;
(function (NPS) {
    var VisitorCenters = /** @class */ (function (_super) {
        __extends(VisitorCenters, _super);
        function VisitorCenters(data, container) {
            var _this = _super.call(this, data, container) || this;
            _this.render = function () {
                _this.clear();
                var header = document.createElement("header");
                var heading = document.createElement("h1");
                heading.textContent = "Visitor Centers";
                header.appendChild(heading);
                _this.container.appendChild(header);
                for (var _i = 0, _a = _this.data; _i < _a.length; _i++) {
                    var visitor_center = _a[_i];
                    var vc_desc = visitor_center.description, vc_name = visitor_center.name, vc_directions = visitor_center.directionsInfo;
                    var title = document.createElement("h4");
                    title.textContent = vc_name;
                    var description = document.createElement("div");
                    description.classList.add("vc-desc");
                    description.textContent = vc_desc;
                    var directions = document.createElement("div");
                    directions.classList.add("vc-directions");
                    directions.textContent = "Directions: " + vc_directions;
                    _this.container.appendChild(title);
                    _this.container.appendChild(description);
                    _this.container.appendChild(directions);
                }
            };
            _this.render();
            return _this;
        }
        return VisitorCenters;
    }(NPS.PageComponent));
    NPS.VisitorCenters = VisitorCenters;
})(NPS || (NPS = {}));
/// <reference path="Util.ts" />
/// <reference path="Suggestions.ts" />
/// <reference path="DebouncedSearch.ts" />
/// <reference path="Drawer.ts" />
/// <reference path="Background.ts" />
/// <reference path="PageComponents/ParkInfo.ts" />
/// <reference path="PageComponents/Places.ts" />
/// <reference path="PageComponents/LessonPlans.ts" />
/// <reference path="PageComponents/NewsReleases.ts" />
/// <reference path="PageComponents/Articles.ts" />
/// <reference path="PageComponents/Events.ts" />
/// <reference path="PageComponents/Alerts.ts" />
/// <reference path="PageComponents/VisitorCenters.ts" />
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
                        var park_code = document.querySelector("meta[name='park-name']").getAttribute('content');
                        var campgrounds_args = {
                            parkCode: park_code
                        };
                        var campgrounds_search = new NPS.APICall('/campgrounds', campgrounds_args, function (data) {
                            // console.log(data);
                        });
                        var visitor_centers_args = {
                            parkCode: park_code,
                            limit: 5
                        };
                        new NPS.APICall('/visitorcenters', visitor_centers_args, function (data) {
                            new NPS.VisitorCenters(data.data, document.getElementById("park-visitor-centers"));
                        });
                        var alerts_args = {
                            parkCode: park_code,
                            limit: 10
                        };
                        new NPS.APICall('/alerts', alerts_args, function (data) {
                            new NPS.Alerts(data.data, document.getElementById("park-alerts"));
                        });
                        var events_args = {
                            parkCode: park_code,
                            limit: 10
                        };
                        var events_search = new NPS.APICall('/events', events_args, function (data) {
                            // console.log(data);
                            new NPS.Events(data.data, document.getElementById("park-events"));
                        });
                        var articles_args = {
                            parkCode: park_code,
                            limit: 7
                        };
                        new NPS.APICall('/articles', articles_args, function (data) {
                            new NPS.Articles(data.data, document.getElementById("park-articles"));
                        });
                        var news_releases_args = {
                            parkCode: park_code,
                            limit: 6
                        };
                        new NPS.APICall('/newsreleases', news_releases_args, function (data) {
                            new NPS.NewsReleases(data.data, document.getElementById("park-news-releases"));
                        });
                        var people_args = {
                            parkCode: park_code
                        };
                        var people_search = new NPS.APICall('/people', people_args, function (data) {
                            // console.log(data);
                        });
                        var lesson_plans_args = {
                            parkCode: park_code
                        };
                        new NPS.APICall('/lessonplans', lesson_plans_args, function (data) {
                            new NPS.LessonPlans(data.data, document.getElementById("park-lesson-plans"));
                        });
                        // Not sure this exists?
                        var places_args = {
                            parkCode: park_code
                        };
                        new NPS.APICall('/places', places_args, function (data) {
                            // console.log(data);
                            new NPS.Places(data, document.getElementById("park-places"));
                        });
                        var park_data_args = {
                            parkCode: park_code,
                            fields: 'images'
                        };
                        new NPS.APICall('/parks', park_data_args, function (data) {
                            new NPS.ParkInfo(data.data, document.getElementById("park-info"));
                        });
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