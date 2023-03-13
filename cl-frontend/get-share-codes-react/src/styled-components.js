import styled from "styled-components";

// FIRST BREAK 550PX

export const ContentWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
`;
export const HeadingText = styled.div`
color: #42307d;
font-weight: 600;
font-size: 32px;
margin-bottom: 10px;
text-align: center;
line-height: 36px;
@media (max-width: 550px) {
    font-size: 28px;
}
`;
export const SubHeadingText = styled.div`
color: #1d2939;
font-size: 18px;
margin: 10px 60px;
text-align: center;
@media (max-width: 550px) {
    margin: 10px 30px;
    font-size: 16px;
}
`;
export const CodeRow = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 100%;
@media (max-width: 550px) {
    flex-direction: column;
}
`
export const CodeText = styled.div`
width: 150px;
margin: 25px 0px;
padding: 5px 0px;
text-align: center;
font-size: 24px;
color: #1d2939;
cursor: pointer;
transition: 0.3s;
&:hover {
    background-image: linear-gradient(90deg, #a93dff, #583dff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transform: scale(1.1);
}
`
export const CopyWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
animation-name: makeVisible;
animation-duration: 3s;
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
export const CopyIcon = styled.svg`
width: 25px;
height: 25px;
background-color: transparent;
background-image: url('https://uploads-ssl.webflow.com/63519b38913fa9eddfe085a6/63e58ce9e0558473b4f39d04_copy-success-svgrepo-com.svg');
background-repeat: no-repeat;
background-size: contain;
border: none;
`
export const CopyText = styled.div`
color: #23242a;
font-size: 14px;
padding-left: 5px;
`
export const DiscordShareContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 20px 0px;
@media (max-width: 550px) {
    flex-direction: column-reverse;
    text-align: center;
}
`
export const DiscordButtonRow = styled.a`
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
export const DiscordImage = styled.img`
filter: invert(0%);
transition: 0.4s;
padding-right: 10px;
`
export const DiscordText = styled.div `
color: #23242a;
font-size: 16px;
margin: 10px 0px;
transition: 0.4s;
font-weight: 500;
`
export const ShareRowText = styled.div`
color: #23242a;
font-size: 18px;
margin: 10px 0px;
@media (max-width: 550px) {
    margin-bottom: 36px;
}
`
export const CodeCopyCol = styled.div`
display: flex;
flex-direction: column;
align-items: center;
height: 115px;
border: none;
`