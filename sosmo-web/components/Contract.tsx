import React, { FC, useCallback, useEffect, useState } from 'react';



export const Contract:FC= ({children}) => {
    console.log(children[0]);

    return(
        <>
            <div className=" my-5">
                <button className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                <span>Create terms</span>
                </button>
            </div>
        </>
    );
}