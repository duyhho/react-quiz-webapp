import React from 'react'
import styled, { css } from 'styled-components'
import Button from './Button';

const Intro = styled.div`
  margin-top: 8em;
  text-align: center;
`;

const Start = ({ props }) => {

    const startQuiz = () => props(true)


    return (
        // Use Bootstrap's flex utilities for vertical centering
        <div className="d-flex flex-column justify-content-center align-items-center vh-100"
            style={{ paddingBottom: 100, backgroundColor: 'var(--color-warm-orange)' }}>
            <h1><i>loveprints</i> quiz</h1>
            <h4>discover yourself.</h4>
            <div className="mt-1">
                <Button onClick={startQuiz}>
                    <b>begin</b>
                </Button>
            </div>
        </div>
    );
}

export default Start
