import React from "react";
export default function Editable(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <div className={props.className} contentEditable={true} onFocus={(e) => {
            const range = document.createRange();
            range.selectNodeContents(e.currentTarget);
            const sel = window.getSelection()!;
            sel.removeAllRanges();
            sel.addRange(range);
        }}>
            {props.children}
        </div>
    )
}