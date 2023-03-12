import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TailSpin } from 'react-loader-spinner'

export function SubmitButton() {
    // constants, states
    const uuid = getCookie('cl-uuid');
    const [cookieStatus, setCookieStatus] = useState('PENDING');
    const [submitStatus, setSubmitStatus] = useState(false);

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
    async function validateUuid(uuid) {
        // avoid unecesary hit of api (redirect)
        if (!uuid) {
            return('UNAUTHORIZED')
        }

        const body = {
            uuid: uuid
        }

        const res = await fetch("https://mqfzmdl5ez3zjsqdod72rvzlru0xytjq.lambda-url.us-west-1.on.aws/", {
            method: 'POST',
            body: JSON.stringify(body)
        })
        // Bad Gateway on endpoint
        if (res.status === 502) {
            return('INTERNAL_ERROR')
        }

        // unauthorized redirect
        if (res.status === 401) {
            return('UNAUTHORIZED')
        }

        // return to evaluate
        return(res.json())



    }
    async function updateValidateUuid(uuid) {
        setCookieStatus(await validateUuid(uuid))   
    }
    function collectInputFields() {
        const inputObj = {
            twitterHandle: document.getElementById('twitter-2')?.value,
            discordHandle: document.getElementById('discord-2')?.value,
            description: document.getElementById('description')?.value,
            upToDate: document.getElementById('up-to-date')?.value,
            nftCreation: document.getElementById('nft-creation')?.value,
            goals: document.getElementById('Goals')?.value,
            idols: document.getElementById('idols')?.value,
            currentProjects: document.getElementById('current-projects')?.value
        }

        // if input is empty return false
        const vals = Object.values(inputObj);
        for (const v of vals) {
            if (!v) {
                return false;
            }
        }
        return inputObj
    }
    async function submitHandler(uuid) {
        const inputObj = collectInputFields();
        if (!inputObj) {
            return('INCOMPLETE')
        }
        const body = {
            clUuid: uuid,
            twitterHandle: inputObj.twitterHandle,
            discordHandle: inputObj.discordHandle,
            description: inputObj.description,
            upToDate: inputObj.upToDate,
            nftCreation: inputObj.nftCreation,
            goals: inputObj.goals,
            inspo: inputObj.idols,
            projInspo: inputObj.currentProjects
        }
        try {
            const res = await fetch("https://b2guggbptcqfu4ov4mroh4lq3q0elkab.lambda-url.us-west-1.on.aws/", {
                method: 'POST',
                body: JSON.stringify(body)
            })
        } catch {
            return('INTERNAL_ERROR');
        }
        // Bad Gateway on endpoint
        if (res.status === 502) {
            return('INTERNAL_ERROR');
        }

        // unauthorized call wipe dat cook!
        if (res.status === 401) {
            return('UNAUTHORIZED');
        }

        return('SUCCESS');
    }
    async function updateSubmitHandler(uuid) {
        setSubmitStatus('PENDING');
        setSubmitStatus(await submitHandler(uuid));
    }

    // RUN ON MOUNT
    useEffect(() => {
        updateValidateUuid(uuid);
    }, [])

    // RUN ON COOKIE STATUS CHANGE (REDIRECT)
    useEffect(() => {
        if (cookieStatus === 'PENDING') {
            return;
        }
        // REDIRECT AUTH
        if (cookieStatus === 'UNAUTHORIZED' || !cookieStatus?.isWallet) {
            window.location.href = '/auth';
        }

        // REDIRECT SHARE
        if (cookieStatus?.isUsed) {
            window.location.href = '/share';
        }
    }, [cookieStatus])

    // RUN ON SUBMIT STATUS CHANGE (REDIRECT)
    useEffect(() => {
        if (submitStatus === 'SUCCESS') {
            window.location.href = './share'
        }
    }, [submitStatus])
    
    return (
        <>
            {/* INITIAL */}
            {!submitStatus && 
            <DummyContainer>
                <StyledButton onClick={() => {updateSubmitHandler(uuid)}} id="submit-button-react">Apply!</StyledButton>
            </DummyContainer>
            }
            {/* PENDING */}
            {submitStatus === 'PENDING' && 
            <DummyContainer>
                <StyledButton disabled id="submit-button-react">Apply!</StyledButton>
                <TailSpin 
                    color="#42307d"
                    height={25}
                    width={25}/>
            </DummyContainer>
            }
            {/* SUCCESS */}
            {submitStatus === 'SUCCESS' && 
            <DummyContainer>
                <StyledButton disabled id="submit-button-react">Apply!</StyledButton>
                <StyledGoodResponse>Success!</StyledGoodResponse>
            </DummyContainer>
            }
            {/* UNAUTHED */}
            {submitStatus === 'UNAUTHORIZED' && 
            <DummyContainer>
                <StyledButton disabled id="submit-button-react">Apply!</StyledButton>
                <StyledBadResponse>Unauthorized!</StyledBadResponse>
            </DummyContainer>}
            {/* UPSTREAM ERR */}
            {submitStatus === 'INTERNAL_ERROR' &&
            <DummyContainer>
                <StyledButton disabled id="submit-button-react">Apply!</StyledButton>
                <StyledBadResponse>Hmm... Looks like something went wrong. Please refresh and try again :/</StyledBadResponse>
            </DummyContainer>}
            {/* INCOMPLETE */}
            {submitStatus === 'INCOMPLETE' &&
            <DummyContainer>
                <StyledButton disabled id="submit-button-react">Apply!</StyledButton>
                <StyledBadResponse>Please complete form</StyledBadResponse>
            </DummyContainer>}
        </>
    )
}

const DummyContainer = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
`
const StyledButton = styled.button`
display: block;
text-align: center;
border: none;
width: 100%;
color: #fff;
padding: 9px 0px;
background-color: #1d2939;
border-radius: 8px;
cursor: pointer;
box-shadow: 1px 1px 3px 0 rgba(16, 24, 40, 0.05);
transition: 0.3s;
&:hover {
    opacity: 0.8;
}
&:disabled {
    background-color: gray;
    cursor: help;
}
`
const StyledGoodResponse = styled.div`
margin: 10px;
color: #006400;
`
const StyledBadResponse = styled.div`
margin: 10px;
color: #FC100D;
`