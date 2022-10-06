import React from "react";
import './Spinner.css'

function Spinner({ ...props }) {
    return (
        <div {...props} className="lds-facebook"><div></div><div></div><div></div></div>
    );
}

export default Spinner;