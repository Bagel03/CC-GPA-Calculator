import {recalculateGrade} from "./recalc";

type assignmentInfo = {
    index:number,
    score:number,
    max:number
}

export function appendExtraCreditInfo(classID: string) {
    const gradedItems = document.getElementsByClassName("table-striped");

    for(let i = 0; i < gradedItems.length; i++) {
        const sectionTable = gradedItems[i];

        const section = sectionTable.previousElementSibling.id;

        console.log(section)

        const scoreValue =
            parseFloat(sectionTable.previousElementSibling.querySelector(".muted").innerHTML) / 100;

        console.log(scoreValue)

        const headerRows = sectionTable
            .getElementsByTagName("thead")[0]
            .getElementsByTagName("tr");

        const actualRows = sectionTable.getElementsByTagName("tr")

        //points earned / scoreValue = total number of points available
        let pointsEarned = 0;
        let countedTotalPointsAvailable = 0;
        //Points that are obvious (i.e. 41/40)
        let obviousExtraCreditPoints = 0;

        let assignments:assignmentInfo[] = []

        for(let i = 0; i<actualRows.length; i++) {
            let row = actualRows[i]

            const checkCell = row.insertCell(0)

            checkCell.className = "ec-checkbox"

            const thisScore = row.querySelector(`[data-heading="Points"]`)

            if(thisScore != null) {
                const [earned, available] = thisScore.firstChild.textContent.split("/").map(e => parseInt(e))

                pointsEarned += earned
                countedTotalPointsAvailable += available
                obviousExtraCreditPoints += Math.max(0, earned-available);

                assignments.push({index: i, score: earned, max: available})
            }

            //Check for table header
            if(i === 0) {
                checkCell.innerText = "E.C."
            } else {
                const inputEle = document.createElement("input")

                inputEle.type = "checkbox"

                inputEle.onclick = () => {recalculateGrade(classID)}

                checkCell.appendChild(inputEle)

            }
        }

        //If the section score is not a number, then this is likely a full extra credit category
        if(isNaN(scoreValue)) {
            assignments.forEach(e => {
                let checkbox = actualRows[e.index].getElementsByClassName("ec-checkbox")[0].firstChild as HTMLInputElement

                checkbox.checked = true
            })
        } else {

            //The total number of points available based on the percentage score and number earned
            const actualTotalAvailable = Math.round(pointsEarned/scoreValue)
            let missingPoints = countedTotalPointsAvailable - actualTotalAvailable - obviousExtraCreditPoints;
            let possibleAssignments = assignments;

            while(missingPoints > 0 && possibleAssignments.length > 0) {

                possibleAssignments = assignments.filter(e => e.max <= missingPoints)

                for(let i = 0; i<possibleAssignments.length; i++) {
                    let thisAssignment = possibleAssignments[i]

                    if(thisAssignment.score <= missingPoints) {
                        missingPoints -= thisAssignment.score

                        let checkbox = actualRows[thisAssignment.index].getElementsByClassName("ec-checkbox")[0].firstChild as HTMLInputElement

                        checkbox.checked = true
                    }
                }
            }
        }
    }
}