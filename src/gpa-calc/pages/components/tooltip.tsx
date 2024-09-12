import React from "react";

function TooltipElement(props: {text: string}) {
    return <div style={{
        position: "relative",
        backgroundColor: "black",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
        zIndex: 1000,
        top: "-50%",
        left: "0"
    }}>{props.text}</div>
}

export default function Tooltip(props: {text: string, children: React.ReactNode}) {
    const [open, setOpen] = React.useState(false);
    
    if(props.text === "") {
        return <span>{props.children}</span>
    }
    
    return <span
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
    >
        {open ? <TooltipElement text={props.text} /> : null}
        {props.children}
        <span>*</span>
    </span>
}