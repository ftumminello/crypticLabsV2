import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TailSpin } from 'react-loader-spinner'

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
setCookie('cl-uuid', 'M0pPcnp1LUV3Y0tnMS1qYmt5RkUtNHJDbzlkLXdoZnVJai1NWVFBckk=', 1)

export function ShareCodesPage() {
    const [applicationStatus, setApplicationStatus] = useState('Loading');
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
    async function getApplicationStatus() {
        const res = await fetch("https://mqfzmdl5ez3zjsqdod72rvzlru0xytjq.lambda-url.us-west-1.on.aws/", {
            method: 'POST',
            body: JSON.stringify({uuid: uuid})
        })
        return(res.json());
    }
    async function updateApplicationStatus() {
        setApplicationStatus('Loading');
        setApplicationStatus(await getApplicationStatus());
    }
    const uuid = getCookie('cl-uuid');
    useEffect(() => {
        updateApplicationStatus();
    }, [])

    if (applicationStatus === 'Loading') {
        // return the Loader
        return(
            <ContentWrapper>
                <TailSpin 
                height='80'
                width='80'
                color='#42307d'
                />
            </ContentWrapper>
        )
    }
    if (applicationStatus.applicationStatus) {
        // return CodesView
        return (
            <ShareCodesView uuid={uuid}/>
        )
    }

    // return PendingView
    return (
        <div>Pending...</div>
    )
}

function ShareCodesView({uuid}) {
    // use state for share codes arr obj
    const [shareCodeState, setShareCodeState] = useState('Loading');
    async function getShareCodes() {
        const res = await fetch("https://ipcnercyyal4h6bzfphqq7nazu0pxyfb.lambda-url.us-west-1.on.aws/", {
            method: 'POST',
            body: JSON.stringify({uuid:uuid})
        })
        if (res.status !== 200) {
            return false;
        }
        return(res.json());
    }
    async function updateShareCodes() {
        setShareCodeState(await getShareCodes());
    }

    useEffect(() => {
        updateShareCodes();
    }, [])
    console.log(shareCodeState)

    // error handling
    if (!shareCodeState) {
        return (
            <div>Unexpected error occured please refresh the page!</div>
        )
    }
    // loading
    if (shareCodeState === 'Loading') {
        // return the Loader
        return(
            <ContentWrapper>
                <TailSpin 
                height='80'
                width='80'
                color='#42307d'
                />
            </ContentWrapper>
        )
    }

    // Final Return
    return (
        <ContentWrapper>
            <HeadingText>Congrats!</HeadingText>
            <SubHeadingText>Share these codes with your friends so they can apply too!</SubHeadingText>
            <CodeContainer>
                <CodeText>{shareCodeState.sharerow1}</CodeText>
                <CodeText>{shareCodeState.sharerow2}</CodeText>
                <CodeText>{shareCodeState.sharerow3}</CodeText>
            </CodeContainer>
        </ContentWrapper>
    )

}

const ContentWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;
const HeadingText = styled.div`
color: #42307d;
font-weight: 600;
font-size: 32px;
`;
const SubHeadingText = styled.div`
color: #23242a;
font-size: 18px;
`;
const CodeContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
width: 400px
`
const CodeText = styled.div`
font-size: 40px;
text-shadow: 2px 2px 3px rgb(0 0 0 / 36%);
background-image: linear-gradient(90deg, #a93dff, #583dff);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
`
