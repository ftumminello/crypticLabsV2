import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TailSpin } from 'react-loader-spinner'

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
        if (res.status === 502) {
            return ('INTERNAL_ERROR')
        }
        // if blank cookie or bad body format
        if (res.status === 401) {
            return('REDIRECT')
        }
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
    if (applicationStatus === 'INTERNAL_ERROR') {
        // return InternalErrorView
    }
    // if uuid does not exist
    if (!applicationStatus?.isUsed || applicationStatus === 'REDIRECT') {
        window.location.href = "/auth";
    }
    // if application status is true
    if (applicationStatus?.applicationStatus) {
        // return CodesView
        return (
            <ShareCodesView uuid={uuid}/>
        )
    }
    // else return PendingView
    return (
        <PendingView></PendingView>
    )
}

function ShareCodesView({uuid}) {
    // use state for share codes arr obj
    const [shareCodeState, setShareCodeState] = useState('Loading');
    const [copyAnimateState, setCopyAniamte] = useState([false, false, false]);
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
                <CodeText 
                onClick={() => {
                    const copyOfState = [...copyAnimateState];
                    copyOfState[0] = true;
                    setCopyAniamte(copyOfState);
                    navigator.clipboard.writeText(shareCodeState.promo1);}
                }
                >{shareCodeState.promo1}</CodeText>
                <CodeText
                onClick={() => {
                    const copyOfState = [...copyAnimateState];
                    copyOfState[1] = true;
                    setCopyAniamte(copyOfState);
                    navigator.clipboard.writeText(shareCodeState.promo2);}
                }>{shareCodeState.promo2}</CodeText>
                <CodeText
                onClick={() => {
                    const copyOfState = [...copyAnimateState];
                    copyOfState[2] = true;
                    setCopyAniamte(copyOfState);
                    navigator.clipboard.writeText(shareCodeState.promo3);}
                }>{shareCodeState.promo3}</CodeText>
            </CodeContainer>
            <CopyContainer>
                <CopyToClip state={copyAnimateState} setState={setCopyAniamte} id={'copy-icon-0'}/>
                <CopyToClip state={copyAnimateState} setState={setCopyAniamte} id={'copy-icon-1'}/>
                <CopyToClip state={copyAnimateState} setState={setCopyAniamte} id={'copy-icon-2'}/>
            </CopyContainer>
        </ContentWrapper>
    )

}
function PendingView() {
    return(
        <ContentWrapper>
            <HeadingText>Pending</HeadingText>
            <SubHeadingText>Your application is pending! Check back later to see if you were accepted.</SubHeadingText>
            <DiscordShareRow>
                <DiscordButtonRow href="/auth">
                    <DiscordImage 
                    src="https://uploads-ssl.webflow.com/63519b38913fa9eddfe085a6/635519ab1bb1a25fc2d8e748_%27.svg"
                    loading="eager"></DiscordImage>
                    <DiscordText>Discord</DiscordText>
                </DiscordButtonRow>
                <ShareRowText>In the meantime check out Cryptic Labs' server for community updates</ShareRowText>
            </DiscordShareRow>
        </ContentWrapper>
    )
}
const ContentWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
`;
const HeadingText = styled.div`
color: #42307d;
font-weight: 600;
font-size: 32px;
margin-bottom: 10px;
`;
const SubHeadingText = styled.div`
color: #23242a;
font-size: 18px;
margin: 10px 60px;
text-align: center;
`;
const CodeContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 100%;
`
const CodeText = styled.div`
width: 150px;
padding: 20px 0px;
text-align: center;
font-size: 40px;
text-shadow: 2px 2px 3px rgb(0 0 0 / 36%);
background-image: linear-gradient(90deg, #a93dff, #583dff);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
cursor: pointer;
transition: 0.3s;
&:hover {
    transform: translate(0px, -10px);
}
`
const CopyContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 100%;
`
const CopyWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
animation-name: makeVisible;
animation-duration: 5s;
animation-iteration-count: 1;
opacity: 0;
width: 150px;

@keyframes makeVisible {
    0% {opacity: 0}
    5% {opacity: 1.0}
    95% {opacity: 1.0}
    100% {opacity: 0}
}
`
const CopyIcon = styled.svg`
width: 25px;
height: 25px;
background-color: #fff;
background-image: url('https://uploads-ssl.webflow.com/63519b38913fa9eddfe085a6/63e58ce9e0558473b4f39d04_copy-success-svgrepo-com.svg');
background-repeat: no-repeat;
background-size: contain;
border: none;
`
const CopyText = styled.div`
color: #23242a;
font-size: 14px;
padding-left: 5px;
`
const DummyCopyWrapper = styled.div`
width:150px;
`
function CopyToClip({id, state, setState}) {
    const idxArr = id.split('-');
    const idx = idxArr[2];
    if (state[idx]) {
        return(
            <CopyWrapper 
            id={id}
            onAnimationEnd={() => {
                const copyOfState = [...state];
                copyOfState[idx] = false;
                console.log(copyOfState)
                setState(copyOfState);
            }}>
                <CopyIcon/>
                <CopyText>Copied!</CopyText>
            </CopyWrapper>
        )
    }
    return(<DummyCopyWrapper></DummyCopyWrapper>)
}
const DiscordShareRow = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 20px 0px;
`
const DiscordButtonRow = styled.a`
width: auto;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
border-radius: 100px;
padding: 2px 38px;
margin: 0px 10px;
border: 2px solid #1e1e1e;
color: #1e1e1e;
background-color: rgba(0,0,0,0);
text-decoration: none;
transition: 0.4s;
cursor: pointer;
&:hover {
    background-color: #1d2939;
}
&:hover div {
    color: #FFFFFF;
}
&:hover img {
    filter: invert(100%);
}
`
const DiscordImage = styled.img`
filter: invert(0%);
transition: 0.4s;
padding-right: 10px;
`
const DiscordText = styled.div `
color: #23242a;
font-size: 16px;
margin: 10px 0px;
transition: 0.4s;
font-weight: 500;
`
const ShareRowText = styled.div`
color: #23242a;
font-size: 18px;
margin: 10px 0px;
`
