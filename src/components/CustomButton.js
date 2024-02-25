import styled from 'styled-components';

export const CustomButton = styled.button`
    /* Using CSS variables for colors */
    border: 1px solid var(--color-deep-purple); /* Dark orange border */
    border-radius: 50px;
    padding: 15px 30px;
    text-decoration: none;
    color: white; /* White text */
    background-color: var(--color-dark-orange); /* Dark orange background */
    transition: 0.3s;
    font-size: 1em;
    cursor: pointer;
    outline: none;

    &:hover {
        color: white; /* Switch to a contrast color or keep it white as per preference */
        background-color: var(--color-bright-orange); /* Lighter color for the hover state */
    }
`;

export default CustomButton;
