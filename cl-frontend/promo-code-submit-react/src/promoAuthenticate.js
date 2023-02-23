import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { TailSpin } from 'react-loader-spinner'

const mobileLarge = '(max-width: 600px)';
const mobileSmall = '(max-width: 380px)';

export function PromoAuthenticate() {
    // functions
    let dummyArray;
    const [promo, setPromo] = useState(['', '', '', '', '', '']);
    const [response, setResponse] = useState(false);
    useEffect(() => {
        if (response?.uuid) {
            // Todo: add expire date and refresh the cookie MVP
            document.cookie = `cl-uuid=${window.btoa(response.uuid)}`
            window.location.href = "https://www.crypticlabs.co/apply";
        }
    }, [response]);
    
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
                    console.log(promo);
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
    
    async function getUUID() {
        // for invalid input to avoid hitting API
        for (let i=0; i<promo.length; i++) {
            console.log(promo[i])
            if (promo[i] === '') {
                return 'Invalid';
            }
        }

        const promoStr = promo.join("");
        const res = await fetch("https://3bnysrzpt2egxdrwphctfbzdqa0ryira.lambda-url.us-west-1.on.aws/", {
            method: 'POST',
            body: JSON.stringify({promo: promoStr}),
        })
        return res.json();
    }

    async function submitPromo() {
        setResponse('pending');
        setResponse(await getUUID());
    }
    return (
        <FormWrapper>
            <StyledInputRow>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-0"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-1"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-2"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-3"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-4"></StyledInput>
                <StyledInput onInput={handlePress} onKeyDown={handleDownStroke} maxLength="6" type="text" id="promo-entry-5"></StyledInput>
            </StyledInputRow>
            {Loader(response)}
            <StyledButton onClick={submitPromo}>Submit</StyledButton>
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

function Loader(res) {
    if (res === 'pending') {
        return(
            <LoaderWrapper>
                <TailSpin 
                    color="#42307d"
                    height={25}
                    width={25}/>
            </LoaderWrapper>
        )
    }
    return null;
}

function ReturnAuthStatus(res) {
    // Loading
    if(!res || res === 'pending') {
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
// Todo: update state on button press