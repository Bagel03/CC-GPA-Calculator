import React from "react";
import { GpaFormula } from "../../../grades/gpa";

export default function ModalFooter(props: {
    currentFormula: GpaFormula, 
    setCurrentFormula: (formula: GpaFormula) => void,
    currentView: "quarter" | "exam",
    setCurrentView: (view: "quarter" | "exam") => void
}) {
    let timePeriodName = props.currentView == "quarter" ? "Quarter" : "Semester";
    return (
        <div className="modal-footer">
            <button className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                Change GPA Formula <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" style={{transform: "translateY(-100%)"}}>
                {GpaFormula.allFormulas.map(formula => (
                    <li key={formula.id} className={props.currentFormula == formula ? "active" : ""}>
                        <a onClick={() => props.setCurrentFormula(formula)}>{formula.name}</a>
                    </li>
                ))}
            </ul>

            <button className="btn btn-default disabled">Last {timePeriodName}</button>
            <button className="btn btn-default disabled">Next {timePeriodName}</button>

            <button className="btn btn-default" style={{float: "right"}} onClick={
                () => props.setCurrentView(props.currentView == "exam" ? "quarter" : "exam")
            }>
                {props.currentView == "quarter" ? "Open Exam Calculator" : "Show Quarterly Grades"}
            </button>
        </div>
    )

}