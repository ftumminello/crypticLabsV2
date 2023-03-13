import React, { useEffect, useState } from "react";
import {
    ContentWrapper,
    HeadingText,
    SubHeadingText,
    CodeRow,
    CodeText,
    CopyWrapper,
    CopyIcon,
    CopyText,
    CodeCopyCol
} from "./styled-components";
import { TailSpin } from 'react-loader-spinner'

export function ShareCodesView({uuid}) {
    // states
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

    return (
        <>
        {/* LOADING */}
        {shareCodeState === 'Loading' &&
        <ContentWrapper>
            <TailSpin 
            height='80'
            width='80'
            color='#42307d'
            />
        </ContentWrapper>
        }
        {/* ERROR HANDLING */}
        {!shareCodeState && 
        <div>Error getting sharecodes</div>
        // to add styled bad text here
        }
        {shareCodeState !== 'Loading' &&
        <ContentWrapper>
            <HeadingText>Congrats, you made it!</HeadingText>
            <SubHeadingText>Share these codes with your friends so they can apply too!</SubHeadingText>
            <CodeRow>
                <CodeCopyCol>
                    <CodeText 
                    onClick={() => {
                        const copyOfState = [...copyAnimateState];
                        copyOfState[0] = true;
                        setCopyAniamte(copyOfState);
                        navigator.clipboard.writeText(shareCodeState.promo1);}
                    }
                    >{shareCodeState.promo1}</CodeText>
                    <CopyToClip state={copyAnimateState} setState={setCopyAniamte} id={'copy-icon-0'}/>
                </CodeCopyCol>
                <CodeCopyCol>
                    <CodeText
                    onClick={() => {
                        const copyOfState = [...copyAnimateState];
                        copyOfState[1] = true;
                        setCopyAniamte(copyOfState);
                        navigator.clipboard.writeText(shareCodeState.promo2);}
                    }>{shareCodeState.promo2}</CodeText>
                    <CopyToClip state={copyAnimateState} setState={setCopyAniamte} id={'copy-icon-1'}/>
                </CodeCopyCol>
                <CodeCopyCol>
                    <CodeText
                    onClick={() => {
                        const copyOfState = [...copyAnimateState];
                        copyOfState[2] = true;
                        setCopyAniamte(copyOfState);
                        navigator.clipboard.writeText(shareCodeState.promo3);}
                    }>{shareCodeState.promo3}</CodeText>
                    <CopyToClip state={copyAnimateState} setState={setCopyAniamte} id={'copy-icon-2'}/>
                </CodeCopyCol>  
            </CodeRow>
        </ContentWrapper>
        }
        </>
    )
}
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
}
