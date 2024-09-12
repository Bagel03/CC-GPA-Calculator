import React from "react";
import { ClassInfo } from "../../../api/classes";
import { GpaFormula } from "../../../grades/gpa";
import { Grade } from "../../../grades/grade";
import { ClassType } from "../../../grades/class_type";
import ContentEditable from "../../components/editable";

export default function QuarterTable(props: {
    classes: ClassInfo[],
    setClasses: (classes: ClassInfo[]) => void,
    currentFormula: GpaFormula
}) {
    return (
        <table className="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Grade</th>
                    <th>Weight</th>
                    <th>GPA</th>
                </tr>
            </thead>
            <tbody>
                {props.classes.map((classInfo, index) => (
                    <QuarterTableRow 
                        classes={props.classes}
                        setClasses={props.setClasses}
                        i={index}
                        gpaFormula={props.currentFormula}
                        key={index}
                    />
                ))}
            </tbody>
        </table>
    )
}

function QuarterTableRow(props: {
    classes: ClassInfo[], 
    i: number,
    setClasses: (classes: ClassInfo[]) => void,
    gpaFormula: GpaFormula
}) {
    const info = props.classes[props.i];
    const {setClasses, classes, gpaFormula} = props;
    const grade = new Grade(parseFloat(info.cumgrade) || 100);
    const classType = ClassType.fromName(info.sectionidentifier);

    return (<tr>
        <td>{info.sectionidentifier.replace(/ - [0-9] \(Period [0-9]\)/, "").trim()}</td>
        <td>{classType.name}</td>
        <td><ContentEditable onBlur={(e) => {
            const newPercentage = parseFloat(e.currentTarget.innerText);
            if (isNaN(newPercentage)) {
                return;
            }
            info.cumgrade = newPercentage.toString();
            setClasses(classes);
        }}>{grade.percentage} %</ContentEditable></td>

        <td>{grade.toString()}</td>
        <td>{gpaFormula.calc(grade, classType).toFixed(2)}</td>
    </tr>)

}