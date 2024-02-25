import React, { useState } from 'react';
import styled from 'styled-components';
import { Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';
import EvaluationScreen from './EvaluationScreen';
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
import { Button } from 'react-bootstrap';
import { CustomButton } from './CustomButton'; // Ensure this is the correct import for your Button

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        size='sm'
        style={{ backgroundColor: 'white', color: 'var(--color-dark-orange)', borderColor: 'var(--color-dark-orange)' }}
    >
        {children} &#x25bc;
    </Button>
));


// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().includes(value),
                    )}
                </ul>
            </div>
        );
    },
);
const QuizWindow = styled.div`
    text-align: center;
    font-size: clamp(20px, 2.5vw, 24px);
    background-color: var(--color-warm-orange);
    height: auto;
    padding: 2em;
`;

const SelectScreen = () => {
    const initialSelections = { selfType: '', matchType: '' };
    const [selections, setSelections] = useState(initialSelections);

    const handleSelect = (event) => {
        console.log(event)

        const { name, value } = event.target;
        setSelections({ ...selections, [name]: value });
    };

    const areSelectionsValid = () => selections.selfType && selections.matchType;
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Function to handle finalizing the selections
    const handleFinalizeSelections = () => {
        if (areSelectionsValid()) {
            setShowEvaluation(true);
        } else {
            setErrorMessage('Please select both user type and compatibility type');
        }
    };
    return (
        <QuizWindow>
            <h3>Select user type and compatibility type:</h3>
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <Row>
                        <Col md={4}>
                            <h6>User Type:</h6>
                        </Col>
                        <Col md={4}>
                        </Col>
                        <Col md={4}>
                            <h6>Compatibility Type:</h6>
                        </Col>
                    </Row>
                    <Row className="align-items-center">
                        <Col md={4}>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    {selections.selfType || "Select"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu}>
                                    <Dropdown.Item eventKey="I" onClick={() => handleSelect({ target: { name: 'selfType', value: 'I' } })}>I (Independent)</Dropdown.Item>
                                    <Dropdown.Item eventKey="We" onClick={() => handleSelect({ target: { name: 'selfType', value: 'We' } })}>We (Collaborative)</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={4}>
                            <h6 style={{ margin: 0 }}>I - We Category</h6>
                        </Col>
                        <Col md={4}>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    {selections.matchType || "Select"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu}>
                                    <Dropdown.Item eventKey="I" onClick={() => handleSelect({ target: { name: 'matchType', value: 'I' } })}>I (Independent)</Dropdown.Item>
                                    <Dropdown.Item eventKey="We" onClick={() => handleSelect({ target: { name: 'matchType', value: 'We' } })}>We (Collaborative)</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <hr />
            <CustomButton onClick={handleFinalizeSelections}>Finalize Selections</CustomButton>
            {showEvaluation && (
                <>
                    <hr />
                    <EvaluationScreen selections={selections} />
                </>
            )}
        </QuizWindow>

    );
};

export default SelectScreen;
