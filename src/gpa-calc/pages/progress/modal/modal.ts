import { fetchClasses } from "../../../api/classes.js";
import { fetchClassInfo } from "../../../api/class_info.js";
import { ClassType, getNumberOfClassesOfType } from "../../../grades/class_type.js";
import { createEl } from "../../../utils/elements.js";
import { renderFooter } from "./quarter/footer.js";
import { renderHeader } from "./quarter/header.js";
import { renderTable } from "./quarter/table.js";
import { renderQuarterModal } from "./quarter/modal.js"

let siteModal = document.getElementById("site-modal")


export enum ModalType {
    QUARTER,
    EXAM
}
// @ts-ignore
window.closeGPAModal = closeModal;

export async function renderModal(type: ModalType = ModalType.QUARTER) {
    siteModal = document.getElementById("site-modal")

    const container = createEl("div", ["modal-dialog", "modal-lg"]);
    siteModal.append(container);
    const modal = createEl("div", ["modal-content", "gradebook-analysis", "gpa-calc-modal"]);
    container.append(modal);
    const head = createEl("div", ["modal-header"], `<a class="close fa fa-times" data-dismiss="modal" href="javascript:closeGPAModal()"></a><h1 class="bb-dialog-header media-heading">Catholic Central GPA</h1>`);
    modal.append(head);

    const body = createEl("div", ["modal-body"]);

    body.append(await renderHeader());
    modal.append(body);
    body.style.maxHeight = "784px"
    body.append(createEl("br"))
    const table = await renderTable();
    body.append(table)
    // <div class="muted" style="margin: -15px 0px 25px 110px;">Graph displays assignments in chronological order by Assigned date.</div>
    // body.append()


    modal.append(renderFooter());

    return modal;

    // body.append(await renderHeader());
    // modal.append(body);
    // body.style.maxHeight = "784px"
    // body.append(createEl("br"))
    // const table = await renderTable();
    // body.append(table)
    // // <div class="muted" style="margin: -15px 0px 25px 110px;">Graph displays assignments in chronological order by Assigned date.</div>
    // // body.append()


    // modal.append(renderFooter());
}

function escapeHandler(e: KeyboardEvent) {
    if (e.key == "Escape") {
        closeModal();
    }
}

export function openModal() {

    renderModal();
    siteModal.classList.add("modal", "bb-modal", "in");
    siteModal.style.display = "block";
    document.body.classList.add("modal-open", "overflow-none");
    document.body.append(createEl("div", ["modal-backdrop", "in"], "", { id: "GpaModalBackdrop" }))
    window.addEventListener("keydown", escapeHandler)
}

export function closeModal() {
    siteModal.removeChild(siteModal.children[0]);

    siteModal.classList.remove("modal", "bb-modal", "in");
    siteModal.style.display = "none";
    document.body.classList.remove("modal-open", "overflow-none");

    document.getElementById("GpaModalBackdrop").remove();
    window.removeEventListener("keydown", escapeHandler)

}