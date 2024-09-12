import { useEffect, useState } from "react";
import {createRoot} from "react-dom/client";
import { fetchClasses } from "./api/classes";
import { shortenClassName } from "./utils/shorten_class";
import React from "react";
import { closeModal, openModal } from "./pages/progress/modal/modal";

export function renderCommonElements() {
    const siteModal = document.getElementById("site-modal");
    if(!siteModal) return;
    
    siteModal.innerHTML = "";
    window.addEventListener("keydown", e => {
        if(e.key == "P" && e.ctrlKey && e.shiftKey) {
            createRoot(siteModal).render(<CommandPrompt />);   
            openModal();
            console.log("Opened command prompt");
        }
    })
    console.log("Rendered common elements");    
}



function CommandPrompt() {
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState<Record<string, string>>({});
    const [search, setSearch] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        getLinks().then((links) => {
            setLinks(links);
            setLoading(false);
        });
    }, []);



    if(loading) return null;

    let usableLinks = testLinks(Object.keys(links), search);

    return (
        <div className="modal-dialog modal-md" onBlur={() => {
            // const siteModal = document.getElementById("site-modal");
            setTimeout(() => {
                closeModal();
            }, 100);
        }} onKeyDown={e => {
            if(e.key == "ArrowDown") {
                setCurrentIndex((currentIndex + 1) % usableLinks.length);
                return;
            }
            if(e.key == "ArrowUp") {
                setCurrentIndex((currentIndex - 1 + usableLinks.length) % usableLinks.length);
                return;
            }

            if(e.key == "Enter" && usableLinks.length > 0) {
                window.location.href = links[usableLinks[currentIndex]];
                closeModal();
            }
        }}>
                <div className="modal-content gradebook-analysis">
                    <div className="modal-header">
                        <div className="row m-2">
                            <input type="text" className="col-md-10 p-2" autoFocus onChange={(e) => {
                                setSearch(e.currentTarget.value);
                                setCurrentIndex(0);
                            }} placeholder="Search for a page"/>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div style={{maxHeight: "30vh"}}>
                            {usableLinks.length == 0 ? (<div>No results</div>) : usableLinks.map((name, i) => 
                                <div className={`p-3 ${i == currentIndex && "sec-25-bgc"}`}
                                    onPointerOver={() => setCurrentIndex(i)}
                                >
                                    <a href={links[name]} key={name} className="pl-2" onClick={() => console.log("hi")}>{name}</a>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
        </div>
    )
}

async function getLinks(): Promise<Record<string, string>> {
    const result = {};
    result["Progress"] = "#studentmyday/progress";
    result["Schedule"] = "#studentmyday/schedule";
    // result["Assignment Center"] = "/app/lms-assignment/assignment-center/student/";
    result["Resources"] = "#resourceboard";
    // I hate hardcoding this, but whatever
    result["Lunch Menu"] = "#resourceboarddetail/11220";

    const classes = await fetchClasses();

    for(const cls of classes) {
        const name = shortenClassName(cls.sectionidentifier);

        result[`${name} / Bulletin Board`] = result[name] =  `#academicclass/${cls.sectionid}/0/bulletinboard`;
        result[`${name} / Topics`] = `#academicclass/${cls.sectionid}/0/topics`;
        result[`${name} / Assignments`] = `#academicclass/${cls.sectionid}/0/assignments`;
        result[`${name} / Roster`] = `#academicclass/${cls.sectionid}/0/roster`;
    }

    return result;
}

function testLinks(allLinkNames: string[], testString: string): string[] {
    testString = testString.trim().toLowerCase();
    if(testString == "") return allLinkNames;

    const testWords = testString.split("/");

    return allLinkNames.filter(name => {
        const words = name.split("/").map(w => w.trim().toLowerCase());
        for(const testWord of testWords) {
            if(!words.some(word => word.includes(testWord))) return false;
        }
        return true;
    })
}