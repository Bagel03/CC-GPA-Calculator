import { useEffect, useState } from "react";
import { ClassInfo, fetchClasses } from "../../../api/classes";
import { GpaFormula } from "../../../grades/gpa";
import React from "react";

export default function GradeModal() {
    const [isPending, setIsPending] = useState(true);
    const [classes, setClasses] = useState<ClassInfo[]>();
    const [currentFormula, setCurrentFormula] = useState(GpaFormula.CC);

    useEffect(() => {
        fetchClasses().then(data => {
            setIsPending(false);
            setClasses(data);
        });
    });

    if(isPending) {
        return <div>Loading...</div>
    }



    
    
}