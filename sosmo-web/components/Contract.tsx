import React, { FC, useCallback, useEffect, useState } from 'react';



export const Contract:FC= ({children}) => {
    console.log(children[0]);

    return(
        <>
            <button className="ml-auto inline-flex items-center h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
            <span>Create terms</span>
            </button>
        </>
    );
}