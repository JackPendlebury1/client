import React from "react";
import { MenuBar } from "./menubar";
import "./pdfviewer.scss";
import { Bundle } from "../../components/";

const PDFJSViewer = (props) => (
    <Bundle loader={import(/* webpackChunkName: "pdfjs" */"./pdfviewer_lazy")} symbol="PDFJSViewer">
        {(Comp) => <Comp {...props}/>}
    </Bundle>
);

export function PDFViewer({ filename, data }) {
    return (
        <div className="component_pdfviewer">
            <MenuBar title={filename} download={data} />
            <div className="pdfviewer_container">
                {
                    "application/pdf" in navigator.mimeTypes ? (
                        <embed
                            src={`${data}#toolbar=0`}
                            type="application/pdf"
                            style={{ height: "100%", width: "100%" }}>
                        </embed>
                    ) : (
                        <PDFJSViewer src={data} />
                    )
                }
            </div>
        </div>
    );
};
