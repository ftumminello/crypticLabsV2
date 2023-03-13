import React from "react";
import {
    ContentWrapper,
    HeadingText,
    DiscordShareContainer,
    DiscordButtonRow,
    DiscordImage,
    DiscordText,
    ShareRowText
} from "./styled-components"

export function PendingView() {
    return(
        <ContentWrapper>
            <HeadingText>Pending</HeadingText>
            <DiscordShareContainer>
                <DiscordButtonRow target="_blank" href="https://discord.gg/ugDuhaEXtz">
                    <DiscordImage 
                    src="https://uploads-ssl.webflow.com/63519b38913fa9eddfe085a6/635519ab1bb1a25fc2d8e748_%27.svg"
                    loading="eager"></DiscordImage>
                    <DiscordText>Discord</DiscordText>
                </DiscordButtonRow>
                <ShareRowText>In the meantime check out Cryptic Labs' server for community updates</ShareRowText>
            </DiscordShareContainer>
        </ContentWrapper>
    )
}