import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import GameOver from './GameOver';
import Button from './Button';
const QuizWindow = styled.div`
    text-align: center;
    font-size: clamp(20px, 2.5vw, 24px);
    background-color: var(--color-warm-orange);
    height: 98vh;
    padding:2em;
`;

const Options = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    margin: 2em auto;

    @media screen and (min-width: 1180px) {
        width: 50%;
    }
`;

const Option = styled.button`
    display: block;
    border: 1px solid var(--color-dark-purple);
    border-radius: 30px;
    padding: 15px 30px;
    text-decoration: none;
    color: '#616A94';
    background-color: white;
    transition: 0.3s;
    font-size: 1em;
    outline: none;
    user-select: none;
    margin-top: 1em;
    cursor: pointer;
    
    @media screen and (min-width: 1180px) {
        &:hover {
            color: white;
            background-color: var(--color-soft-coral);
        }
    }
`;

const quizQuestions = [
    {
        id: 1,
        question: "Which behavior or mindset best represents you?",
        options: [
            { text: "I prefer making decisions based on my own opinions and benefits.", type: "I" },
            { text: "I value group consensus and making decisions that benefit everyone.", type: "We" }
        ]
    },
    {
        id: 2,
        question: "Which behavior or mindset best represents the person you'd like to match with?",
        options: [
            { text: "Someone who is independent and prioritizes their own goals.", type: "I" },
            { text: "Someone who values collaboration and prioritizes the group's well-being.", type: "We" }
        ]
    }
];


const Quiz = () => {
    const initialSelections = { selfType: '', matchType: '' };
    const [selections, setSelections] = useState(initialSelections);
    const [number, setNumber] = useState(0);

    const pickAnswer = (type) => {
        const newSelections = { ...selections };
        if (number === 0) {
            newSelections.selfType = type;
        } else if (number === 1) {
            newSelections.matchType = type;
        }
        setSelections(newSelections);
        setNumber(number + 1);
    };

    return (
        number < quizQuestions.length ? (
            <QuizWindow>
                <h3>{quizQuestions[number].question}</h3>
                <Options>
                    {quizQuestions[number].options.map((option, index) => (
                        <Option key={index} onClick={() => pickAnswer(option.type)}>
                            {option.text}
                        </Option>
                    ))}
                </Options>
            </QuizWindow>
        ) : (
            <GameOver selections={selections} />
        )
    );

};

export default Quiz
