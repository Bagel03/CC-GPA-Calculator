import { fetchClasses } from "../../api/classes";
import { createEl } from "../../utils/elements";

export async function renderClassPage() {
    console.log("Rendering class page");
    //https://catholiccentral.myschoolapp.com/app/student#academicclass/XXXXXX/0/topics
    const id = window.location.hash.split("/")[1];

    const classInfo = await fetchClasses().then(arr => arr.find(cls => cls.sectionid?.toString() == id));

    const bubble = createEl(
        "span",
        ["label", "label-success"],
        classInfo.cumgrade || "No Grade",
        {
            id: "classGradeBubble",
        },
        {
            backgroundColor: "#004F9E",
            verticalAlign: "middle",
        }
    );

    document.getElementsByClassName("bb-page-heading")[0].append(bubble);
}
