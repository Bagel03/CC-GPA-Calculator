export function appendExtraCreditInfo() {
    const gradedItems = document.getElementsByClassName("table-striped");

    for(let i = 0; i < gradedItems.length; i++) {
        const el = gradedItems[i];

        const headerRows = el
            .getElementsByTagName("thead")[0]
            .getElementsByTagName("tr");

        const actualRows = el.getElementsByTagName("tr")

        for(let i = 0; i<actualRows.length; i++) {
            let row = actualRows[i]

            const checkCell = row.insertCell(0)

            //Check for table header
            if(i === 0) {
                checkCell.innerText = "E.C."
            } else {
                const inputEle = document.createElement("input")

                inputEle.type = "checkbox"

                checkCell.appendChild(inputEle)

            }
        }
    }
}