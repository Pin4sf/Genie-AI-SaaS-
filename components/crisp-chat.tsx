"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(()=>{
        Crisp.configure("dd28c01b-65f5-461e-b309-05b7a3d6b872")
    },[])
    return null;
}
