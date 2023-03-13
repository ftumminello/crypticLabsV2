import React, { useEffect, useState } from "react";
import { TailSpin } from 'react-loader-spinner'
import { PendingView } from "./pending";
import { ShareCodesView } from "./codes";
import { ContentWrapper } from "./styled-components";

export function ShareCodesPage() {
    // state and constants
    const [applicationStatus, setApplicationStatus] = useState('Loading');
    const uuid = getCookie('cl-uuid');
    
    // functions
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
    async function getApplicationStatus(uuid) {
        // if blank cookie
        if (uuid === "") {
            return('REDIRECT')
        }
        const res = await fetch("https://mqfzmdl5ez3zjsqdod72rvzlru0xytjq.lambda-url.us-west-1.on.aws/", {
            method: 'POST',
            body: JSON.stringify({uuid: uuid})
        })
        if (res.status === 502) {
            return ('INTERNAL_ERROR')
        }
        // if bad body format (unauthed)
        if (res.status === 401) {
            return('REDIRECT')
        }
        return(res.json());
    }
    async function updateApplicationStatus() {
        setApplicationStatus('Loading');
        setApplicationStatus(await getApplicationStatus(uuid));
    }
    
    // RUN ON MOUNT
    useEffect(() => {
        updateApplicationStatus(uuid);
        
    }, [])

    useEffect(() => {
        // REDIRECTS
        if (applicationStatus === 'Loading') {
            return;
        }

        if (!applicationStatus?.isWallet || applicationStatus === 'REDIRECT') {
            window.location.href = '/auth';
            return;
        }
        // if isUsed goto apply
        if (!applicationStatus?.isUsed) {
            window.location.href = '/aanfhqzp2m'
            return;
        }
    }, [applicationStatus])

    return(
        <>
        {/* LOADER */}
        {applicationStatus === 'Loading' &&
            <ContentWrapper>
                <TailSpin 
                height='80'
                width='80'
                color='#42307d'
                />
            </ContentWrapper>
        }
        {/* BAD GATEWAY (502) */}
        {applicationStatus === 'INTERNAL_ERROR' &&
            // TO REPLACE WITH BAD TEXT VIEW
            <div>INTERNAL error</div> 
        }
        {/* SHARECODES VIEW */}
        {applicationStatus?.applicationStatus &&
            <ShareCodesView uuid={uuid}/>
        }
        {/* PENDING VIEW */}
        {applicationStatus !== 'Loading' && !applicationStatus?.applicationStatus &&
            <PendingView/>
        }
        </>
    )
}