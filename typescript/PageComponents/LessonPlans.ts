/// <reference path="PageComponent.ts" />

namespace NPS {
    export class LessonPlans extends PageComponent {
        constructor(data: Array<any>, container: HTMLElement) {
            super(data, container);

            this.render();
        }

        render = () => {
            this.clear();

            const header = document.createElement("header");
            const heading = document.createElement("h1");
            heading.textContent = "Lesson Plans";

            header.appendChild(heading);
            this.container.appendChild(header);

            for (const lesson_plan of this.data) {
                const {
                    title: lesson_title,
                    url: lesson_url,
                    duration: lesson_duration, 
                    questionobjective: lesson_objective,
                    subject: lesson_subject
                } = lesson_plan;

                const title = document.createElement("h4");
                const title_a = document.createElement("a");
                title_a.textContent = lesson_title;
                title_a.href = lesson_url;
                title.appendChild(title_a);

                this.container.appendChild(title);

                const duration = document.createElement("div");
                duration.textContent = lesson_duration + ", " + lesson_subject.replace(/,/g, ", ");
                duration.classList.add("duration");
                this.container.appendChild(duration);

                const obj = document.createElement("div");
                obj.classList.add("objective");
                obj.innerHTML = lesson_objective.replace(/;\s*/g, "<br>");

                this.container.appendChild(obj);
            }   
        };
    }
}