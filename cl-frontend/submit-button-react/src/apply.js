import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TailSpin } from 'react-loader-spinner'

export function SubmitButton() {
    // TODO: 
    // Handle redirect
    // --> if UUID not present send to auth
    // --> if UUID is used send to share 
    // Handle submit
    // --> onSubmit check to make sure all fields are populated
    // --> submit all fields to backend with uuid
    // Backend submit handler
    // --> have it check to ensure there is a wallet and a sig attached to uuid being used, if not return 401 unauthed
    // Return status below button
    // --> how do we want to style this?
    // --> 4 states:
    // ----> success: Submitted green message and redirect to share page
    // ----> pending (awaiting response): drop a tail spin like we do on apply
    // ----> failure (unauthed): 
    // ----> upstream failure and they should try again: "Hmm... Looks like something went wrong. Please refresh and try again :praise-hands:"
    
    return (
        <DummyContainer>
            <StyledButton id="submit-button-react">Apply!</StyledButton>
        </DummyContainer>
    )
}

const DummyContainer = styled.div`
width: 100%;
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