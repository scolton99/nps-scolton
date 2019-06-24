/// <reference path="PageComponent.ts" />

namespace NPS {
    export class Events extends PageComponent {
        private year: number;
        private month: number;

        constructor(data: Array<any>, container: HTMLElement) {
            super(data, container);

            const date = new Date();
            this.year = date.getFullYear();
            this.month = date.getMonth();

            this.render();
        }

        static leap_year = (year: number): boolean => {
            return (year % 4 == 0) && ((year % 100 !== 0) || (year % 400 == 0));
        };

        static days_in_month = (month: number, year: number): number => {
            switch (month) {
                case 1: {
                    if (Events.leap_year(year)) {
                        return 29;
                    } else {
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

        back = () => {
            if (this.month == 0) {
                this.month = 11;
                this.year--;
            } else {
                this.month--;
            }

            this.render();
        };

        forward = () => {
            if (this.month == 11) {
                this.month = 0;
                this.year++;
            } else {
                this.month++;
            }

            this.render();
        };

        render = () => {
            this.clear();

            const header = document.createElement("header");
            const heading = document.createElement("h1");
            heading.textContent = "Events";

            header.appendChild(heading);
            this.container.appendChild(header);

            const iter = Events.days_in_month(this.month, this.year);

            for (let i = 0; i < iter; i++) {
                const display_date = i + 1;

                
            }

            const events = this.data.filter(((item: any) => {
                return item.dates.map(date => parseInt(date.split("-")[1]) - 1).includes(this.month);
            }).bind(this));

            
        };
    }
}