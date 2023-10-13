import { fetchClasses } from "../../api/classes.js";

async function renderClassPage() {
    //https://catholiccentral.myschoolapp.com/app/student#academicclass/XXXXXX/0/topics
    const id = window.location.hash.split("/")[1];

    const classInfo = await fetchClasses().then(arr => arr.find(cls => cls.sectionid?.toString() ==id));

    const bubble = createEl(
        "span",
        ["label", "label-success"],
        classInfo.cumGrade,
        {},
        {
            backgroundColor: "#004F9E",
        }
    );

    document.getElementsByClassName("bb-page-heading")[0].append(bubble)
}
