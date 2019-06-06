const API_KEY = "vYkXNZMKQ0WWz7zGZNsC9qrLndwdy9xmfx0Sg2MF";
const API_ROOT = 'https://developer.nps.gov/api/v1';

namespace NPS {
    export class APICall {
        private readonly endpoint: string;
        private readonly args: object;
        private readonly callback: ((object) => any);
        private readonly onerror: ((data: any) => any);

        constructor(endpoint: string, args: object, callback: ((data: any) => any), onerror?: ((data: any) => any), runnow: boolean = true) {
            this.endpoint = endpoint;
            this.args = args;
            this.callback = callback;
            this.onerror = onerror;

            if (runnow)
                this.execute();
        }

        public execute = (): void => {
            const request = APICall.api_req_string('/parks', this.args);
            console.log(request);

            fetch(request).then(data => data.json()).then(this.callback).catch(this.onerror);
        };

        public static api_req_string(endpoint: string, args: object): string {
            const args_copy = JSON.parse(JSON.stringify(args));
            args_copy.api_key = API_KEY;

            const keys = Object.keys(args_copy);
            let arg_str = "";
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = encodeURIComponent(args_copy[key]);

                arg_str += `${key}=${value}`;
                if (i + 1 < keys.length)
                    arg_str += "&"
            }

            return `${API_ROOT}${endpoint}?${arg_str}`
        }
    }
}
