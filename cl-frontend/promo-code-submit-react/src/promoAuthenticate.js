import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { MutatingDots, TailSpin } from 'react-loader-spinner'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const mobileLarge = '(max-width: 600px)';
const mobileSmall = '(max-width: 380px)';

export function PromoAuthenticate() {
    // constants & states
    let dummyArray;
    const [promo, setPromo] = useState(['', '', '', '', '', '']);
    const [response, setResponse] = useState(false);
    const [cookieStatus, setCookieStatus] = useState(false);

    // Wallet Connect states and hooks
    const { address, isConnected } = useAccount();
    const { connect, error } = useConnect({
    connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect()
    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message: 'Embrace this opportunity with open arms, and let the journey begin.\n\nTogether, we will explore the depths of knowledge, challenge ourselves in new ways, and forge bonds that will last a lifetime.',
    })


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
    const handlePress = (event) => {
        // get values
        const idx = event.target.id.split('-')[2];
        const currentPromoValue = promo[idx];
        const value = event.target.value
        // if spacebar
        if (value === " ") {
            event.target.value ='';
            return;
        }
        // if already value in box
        if ((currentPromoValue !== '') && (value !== '')) {
            event.target.value = currentPromoValue;
            return;
        }
        // if user copy pastes code
        if (value.length > 1) {
            for (let i=0; i<value.length; i++) {
                // update value in input box
                document.getElementById(`promo-entry-${i}`).value = value[i];
                
                // update state
                const numIdx = Number(idx);
                dummyArray = promo;
                dummyArray[numIdx+i] = value[i];
                setPromo(dummyArray)

                // if reached the end of input boxes
                if (numIdx+i == 5) {
                    return;
                }

                // if on last iteration of loop
                if (i == (value.length-1)) {
                    document.getElementById(`promo-entry-${i+1}`).focus();
                }
            }
        }    
        // if user manually enters code
        else {
            // make copy of promo and update value
            dummyArray = promo
            dummyArray[idx] = value;

            // set promo
            setPromo(dummyArray);

            //set focus
            for (let i=0; i<promo.length; i++) {
                if (promo[i] === '') {
                    document.getElementById(`promo-entry-${i}`).focus();
                    return;
                }
            }
        } 
    }
    const handleDownStroke = (event) => {        
        const keyCode = event.keyCode;
        // if backspace press
        if (keyCode === 8) {
            const idx = event.target.id.split('-')[2];
            // if already at 0 index input
            if (idx == 0) {
                return;
            }
            if (promo[idx] === '') {
                // set focus to idx - 1
                document.getElementById(`promo-entry-${idx-1}`).focus();
            }
        }
    }
    async function getUUID(signatureMode=false) {
        let bodyObj;
        if (signatureMode) {
            bodyObj = 
            {
                signature: data,
                mode: 'signature'
            }
        } 
        else {
            // for invalid input to avoid hitting API
            for (let i=0; i<promo.length; i++) {
                if (promo[i] === '') {
                    return 'Invalid';
                }
            }
            const promoStr = promo.join("");
            bodyObj = 
            {
                promo: promoStr,
                wallet: address,
                signature: data
            }
        }
        const res = await fetch("https://3bnysrzpt2egxdrwphctfbzdqa0ryira.lambda-url.us-west-1.on.aws/", {
            method: 'POST',
            body: JSON.stringify(bodyObj)
        })
        return res.json();
    }
    async function validateUuidCookie(cookie, wallet) {
        const res = await fetch("https://mqfzmdl5ez3zjsqdod72rvzlru0xytjq.lambda-url.us-west-1.on.aws/", {
            method: 'POST',
            body: JSON.stringify(
                {
                    uuid: cookie,
                    wallet: wallet
                }
            )
        })
        if (res.status === 502) {
            return ('INTERNAL_ERROR');
        }
        // if blank cookie or bad body format
        if (res.status === 401) {
            return('INVALID');
        }
        return res.json();
    }
    async function submitPromo() {
        setResponse('pending');
        setResponse(await getUUID());
    }
    async function checkSignature() {
        setResponse('pending');
        setResponse(await getUUID(true));
    }
    async function validateCookie(cookie) {
        setCookieStatus(await validateUuidCookie(cookie))
    }
    function makeWalletAbrevStr(address) {
        const len = address.length;
        let abrvStr = '';
        for (let i=0; i<11; i++) {
            if (i<6) {
                abrvStr+=address[i];
            }
            else if (i===6) {
                abrvStr+='...'
            }
            else {
                abrvStr+=address[len-11+i]
            }
        }
        return abrvStr
    }
    
    //Hooks
    useEffect(() => {
        const uuidCookie = getCookie("cl-uuid");
        // if cookie exists
        if (uuidCookie !== "") {
            validateCookie(uuidCookie);
            return;    
        }
        if (isConnected) {
            disconnect();
        }
    }, [])

    useEffect(() => {
        if (response?.isUsed) {
            document.cookie = `cl-uuid=${window.btoa(response.uuid)}; max-age=31536000`;
            window.location.href = "/share";
            return;
        }
        if (response?.uuid) {
            document.cookie = `cl-uuid=${window.btoa(response.uuid)}; max-age=31536000`;
            window.location.href = "/aanfhqzp2m";
            return;
        }
    }, [response]);

    useEffect(() => {
        // if valid cookie and application already submitted
        if (cookieStatus?.isUsed === true) {
            window.location.href = "/share";
            return;

        }
        // if valid cookie no application submitted
        if (cookieStatus?.row) {
            window.location.href = "/aanfhqzp2m"
            return;
        }
        // if wallet does not match
        document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        
    }, [cookieStatus])

    useEffect(() => {
        if (isConnected && !data) {
            signMessage();
        } else if (data) {
            checkSignature();
        }
    }, [isConnected, data])

    // if currently signing
    if (isLoading) {
        return(
            <FormWrapper>
                <MutatingDots
                    height="100"
                    width="100"
                    color="#6941c6"
                    secondaryColor="#6941c6"
                    radius='12.5'/>
            </FormWrapper>
        ) 
    }

    // if no signature
    if (!data || !isConnected) {
        return (
            <WalletConnectView connect={connect} isError={isError} isConnected={isConnected} sign={signMessage} connectError={error}/>
        )
    }
    return (
        <FormWrapper>
            <WalletInfoRow>
                <WalletInfoContainer onClick={() => {disconnect()}}>
                    <UnlinkIcon 
                        src="https://uploads-ssl.webflow.com/63519b38913fa9eddfe085a6/63faa98f69cf8021c5076d96_broken-link-broken-link-url-hyperlink-disconnect-svgrepo-com.svg"
                        loading="lazy"/>
                    <WalletInfoText>Disconnect</WalletInfoText>
                </WalletInfoContainer>
                <WalletInfoContainer>
                    <WalletStatusIcon
                        src="https://uploads-ssl.webflow.com/63519b38913fa9eddfe085a6/63faa6a1b8989945a1c7296d_dot-svgrepo-com.svg"
                        loading="lazy"/>
                    <WalletInfoText>{makeWalletAbrevStr(address)}</WalletInfoText>
                </WalletInfoContainer>
            </WalletInfoRow>
            <HeaderText>Enter your code to apply!</HeaderText>
            <StyledInputRow>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-0"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-1"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-2"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-3"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-4"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-5"></StyledInput>
            </StyledInputRow>
            {Loader(response)}
            <StyledButton id="submit-btn" onClick={submitPromo}>Submit</StyledButton>
            {ReturnAuthStatus(response)}
        </FormWrapper>
    )
}
const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`
const StyledInput = styled.input`
height: 40px;
width: 30px;
border-radius: 5px;
background-color: rgba(255, 255, 255, 0.5);
border-color: rgb(52, 64, 84);
border-width: 1px;
color: #42307d;
font-size: 20px;
text-align: center;
font-weight: 500;
margin: 0px 4px 0px 4px;

// mobile
@media ${mobileLarge} {
    height: 48px;
    width: 36px;
    font-size: 16px;
} 
@media ${mobileSmall} {
    font-size: 12px;
} 
`
const StyledInputRow = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-evenly;
margin: 15px 0px 15px 0px;
`
const StyledButton = styled.button`
background-color: #1D2939;
color: white;
border-radius: 5px;
padding: 5px 100px 5px 100px;
transition: 0.25s;
border: none;
cursor: pointer;
&:hover {
    background-color: rgba(29, 41, 57, 0.8);
}
&:disabled {
    background-color: #808080;
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
const LoaderWrapper = styled.div`
margin-bottom: 5px;
`
const WallectConnectContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`
const HeaderText = styled.h2`
color: #42307d;
font-weight: 600;
font-size: 32px;
padding-bottom: 5px;
`
const WalletConnectBtn = styled.a`
text-decoration: none;
margin-top: 20px;
padding: 9px 40px;
font-size: 14px;
color: #1d2939;
background-color: transparent;
border: 2px solid #1d2939;
border-radius: 100px;
cursor: pointer;
transition: 0.3s;

&:hover {
    background-color: #1d2939;
    color: #FFFFFF;
}
`
const WalletInfoRow = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
width: 100%;
padding-bottom: 20px;
`
const WalletInfoContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-evenly;
border: 4px solid #e9d7fe;
border-radius: 100px;
cursor: pointer;
width: 135px;
`
const WalletInfoText = styled.div`
background: linear-gradient(90deg, #a93dff, #583dff);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
animation: gradient 2s linear infinite;
font-size: 14px;
background-size: 400% 400%;
font-weight: 600;
padding-right: 5px;
@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
    }
}
`
const UnlinkIcon = styled.img`
width: 20px;
height: auto;
padding: 2px 0px;
`
const WalletStatusIcon = styled.img`
width: 27px;
height: auto;
`
function WalletConnectView({connect, isError, isConnected, sign, connectError}) {
    return(
        <WallectConnectContainer>
            <HeaderText>Connect Wallet</HeaderText>
            <WalletConnectBtn 
                onClick={
                    () => {
                        if (!isConnected) {
                            connect();
                        } else {
                            sign();
                        }
                    }
                }>
                Connect
            </WalletConnectBtn>
            {isError && <StyledBadResponse>User rejected signature</StyledBadResponse>}
            {connectError && <StyledBadResponse>Looks like you're having issues. Try dowloading the MetaMask extension...</StyledBadResponse>}
        </WallectConnectContainer>
    )    
}
function Loader(res) {
    const submitButton = document.getElementById('submit-btn')
    if (res === 'pending') {
        if (submitButton) {
            submitButton.disabled = true;
        }
        return(
            <LoaderWrapper>
                <TailSpin 
                    color="#42307d"
                    height={25}
                    width={25}/>
            </LoaderWrapper>
        )
    }
    if (submitButton) {
        submitButton.disabled = false;
    }
    return null;
}
function ReturnAuthStatus(res) {
    // Loading
    if(!res || res === 'pending') {
        return;
    }

    // if checking sig
    if (res?.status === 1000) {
        console.log('Hello World');
        return;
    }

    // Bad Input
    if (res === 'Invalid') {
        return( 
            <StyledBadResponse>Invalid Input! Please try again.</StyledBadResponse>
        )
    }
    
    // Authed
    if (res?.uuid) {
        return(
            <StyledGoodResponse>Authenticated!</StyledGoodResponse>
        )
    }

    // Dis man gay
    return (
        <StyledBadResponse>Invalid Passcode! Remaining Attempts: 69</StyledBadResponse>
    )
}