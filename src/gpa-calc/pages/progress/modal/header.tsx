import React from "react";

export default function ModalHeader(props: {closeModal: () => void}) {
    return (
        <div className="modal-header">
<           a className="close fa fa-times" data-dismiss="modal" onClick={props.closeModal}></a>
            <h1 className="bb-dialog-header media-heading">Catholic Central GPA</h1>`
   
        </div>
    )
}