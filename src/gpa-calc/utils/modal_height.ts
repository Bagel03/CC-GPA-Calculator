/* What im going off of
        if (b.modal && b.hasClass("in")) {
            var d = b.find(".modal-header"), a = b.find(".modal-body"), c = b.find(".modal-footer"), e, f = a.scrollTop();
            e = (b.outerHeight()) - (d.outerHeight()) - (c.outerHeight());
            if (!b.hasClass("bb-modal-fullpage")) {
                e -= 60
            }
            a.css("max-height", e);
            a.scrollTop(f);
            p3.clearModalHeightTimer()
        }
    },
*/

export function setModalHeight() {
    const modal = document.querySelector<HTMLDivElement>("#site-modal");
    if (!modal?.classList.contains("in")) return;

    const header = document.querySelector<HTMLDivElement>(".modal-header");
    const body = document.querySelector<HTMLDivElement>(".modal-body");
    const footer = document.querySelector<HTMLDivElement>(".modal-footer");

    const top = body.scrollTop;

    const height =
        modal.getBoundingClientRect().height -
        header.getBoundingClientRect().height -
        footer.getBoundingClientRect().height -
        60;

    body.style.maxHeight = height + "px";
    body.scrollTop = top;
}
