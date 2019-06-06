/// <reference path="Util.ts" />
/// <reference path="Suggestions.ts" />
/// <reference path="APICall.ts" />

namespace NPS {
    export class DebouncedSearch {
        private timeout: number = null;
        private readonly delay: number;
        private last_search: string;
        private suggestions: Suggestions;

        constructor(delay: number, suggestions: Suggestions) {
            this.delay = delay;
            this.suggestions = suggestions;
        }

        //
        private parse_search_text = (): Array<any> => {
            const query_text = (<HTMLInputElement> document.getElementById("search")).value;
            const res = /([^\s]*:[^\s]*)/g.exec(query_text);
            const search_text = query_text.replace(/([^\s]*:[^\s]*)/g, "");

            if (res == null)
                return [search_text.trim(), {}];

            let arg_obj = {};
            for (let i: number = 1; i < res.length; i++) {
                const [key, value]: string[] = res[i].split(":");

                let parsed_value = value;
                parsed_value = parsed_value.replace(/_/g, " ");

                arg_obj[key] = parsed_value;
            }

            return [search_text.trim(), arg_obj];
        };

        private debounced_search = () => {
            const query_text = (<HTMLInputElement> document.getElementById("search")).value;

            if (query_text == "") {
                document.body.classList.remove("searching");
                this.suggestions.clear();
                return;
            }

            this.last_search = query_text;
            this.suggestions.show_loading();

            let [text, obj] = this.parse_search_text();

            const args = {
                q: text,
                limit: 25,
                fields: 'images'
            };

            if (obj.stateCode) {
                args["stateCode"] = obj.stateCode;
                obj.stateCode = void (0);
            }

            new APICall('/parks', args, this.fetch_complete.bind(this, query_text, obj));
        };

        private fetch_complete = (query: string, params: object, data: object): void => {
            if (query != this.last_search)
                return;

            this.suggestions.update(data["data"], params);
        };

        public search = () => {
            if (this.timeout != null)
                window.clearTimeout(this.timeout);

            document.body.classList.add("searching");
            if (this.suggestions.empty())
                this.suggestions.show_loading();

            this.timeout = window.setTimeout(this.debounced_search, this.delay);
        };
    }
}
