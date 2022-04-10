import React, { useState } from "react";

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';


export function UseQuill()  {
    const [value, setValue] = useState('')
    console.log(value);
    return(
       <ReactQuill theme="snow" value={value} onChange={setValue} className="mb-8  rounded-lg h-[400px]"/>
    )
}