import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
`;

export const HeaderText = styled.h1`
    margin: 0.25rem 0;
`;

export const HeaderActions = styled.div`
    position: absolute;
    right: 1rem;
    top: 0.25rem;
    bottom: 0;
`; 

export function Header() {
    
    return (
        <Container>
            <HeaderText> 🙏 JS Game </HeaderText>
        </Container>
    )
}
function useAuth() {
    return gapi.auth2.getAuthInstance();
}
