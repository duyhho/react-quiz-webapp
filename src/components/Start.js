import React from 'react'
import styled, { css } from 'styled-components/macro'
import Button from './Button';

const Intro = styled.div`
  margin-top: 8em;
  text-align: center;
`;

const btnCSS = css`
    margin-top: 2em;
`;


const Start = ({ props }) => {

    const startQuiz = () => props(true)

    return (
        <Intro>
            <h1>take the quiz.</h1>
            <h4>whenever you want.</h4>
            <Button onClick={startQuiz} css={btnCSS}>
                begin
            </Button>
        </Intro>
    )
}

export default Start
