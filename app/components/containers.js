import styled from "styled-components";
import Theme from "../theme";

export const Container = styled.div`
    padding: 2rem;
    display: flex;
    justify-content: center;
    width: ${({wide}) => wide ? "100%" : "initial"};
`;

export const Section = styled.div`
    border: ${props => `1px solid ${Theme.primary}33`};
    border-radius: ${props => Theme.baseRadius};
    width: 100%;
    max-width: 800px;
    padding: 1rem;
    color: ${props => Theme.primary};
`;

export const SectionTitle = styled.p`
    margin: 0;
`; 

export const Game = styled.pre`
    font-size: 2rem;
`

export const Hand = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4rem 1rem;
`

export const Card = styled.button`
    font-family: monospace;
    font-size: 1rem;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    border: 1px solid;
    cursor: pointer;
    &:hover {
        background: rgba(0,0,0,0.2);
    }
`