import { createEl } from "../../../../utils/elements.js";
import { renderFooter } from "./footer.js";
import { renderHeader } from "./header.js";
import { renderTable } from "./table.js";

export async function renderQuarterModal(modal: HTMLDivElement, body: HTMLDivElement) {
    body.append(await renderHeader());
    modal.append(body);
    body.style.maxHeight = "784px"
    body.append(createEl("br"))
    const table = await renderTable();
    body.append(table)
    // <div class="muted" style="margin: -15px 0px 25px 110px;">Graph displays assignments in chronological order by Assigned date.</div>
    // body.append()

    modal.append(renderFooter());
}