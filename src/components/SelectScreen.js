import React, { useState, useEffect } from 'react';
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
const categories = [
    { name: 'I - We Category', types: ['I', 'We'] },
    { name: 'Reflective - Active Category', types: ['Reflective', 'Active'] },
    { name: 'Emotional - Physical Category', types: ['Emotional', 'Physical'] },
    { name: 'Guarded - Open Category', types: ['Guarded', 'Open'] }
];
const SelectScreen = () => {
    let initialSelections = categories.map(() => ({ selfType: null, matchType: null }));
    initialSelections = categories.map((category) => ({
        selfType: category.types[Math.floor(Math.random() * category.types.length)],
        matchType: category.types[Math.floor(Math.random() * category.types.length)]
    }));

    const [selections, setSelections] = useState(initialSelections);
    const [submittedSelections, setSubmittedSelections] = useState(initialSelections);

    const [showEvaluation, setShowEvaluation] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const handleSelect = (index, name, value) => {
        console.log("index", index, "name", name, "value", value)
        setShowEvaluation(false);
        const updatedSelections = [...selections];
        updatedSelections[index] = { ...updatedSelections[index], [name]: value };
        setSelections(updatedSelections);
    };
    const areSelectionsValid = () => selections.every(selection => selection.selfType && selection.matchType);

    const handleFinalizeSelections = () => {
        if (areSelectionsValid()) {
            setSubmittedSelections(selections);
            setShowEvaluation(true);
        } else {
            setErrorMessage('Please select both user type and compatibility type for all categories');
        }
    };
    useEffect(() => {
        console.log("submittedSelections", submittedSelections)
    }, [submittedSelections])
    return (
        <QuizWindow>
            <h3>Select user type and compatibility type:</h3>
            {categories.map((category, index) => (
                <Row key={index}>
                    <Col md={{ span: 8, offset: 2 }}>
                        {index === 0 && (
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
                        )}
                        <Row className="align-items-center mb-2">
                            <Col md={4}>
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle} id={`dropdown-${index}`}>
                                        {selections[index].selfType || "Select"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu as={CustomMenu}>
                                        {category.types.map((type, typeIndex) => (
                                            <Dropdown.Item
                                                key={typeIndex}
                                                eventKey={type}
                                                onClick={() => handleSelect(index, 'selfType', type)}
                                            >
                                                {type}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col md={4}>
                                <h6 style={{ margin: 0 }}>{category.name}</h6>
                            </Col>
                            <Col md={4}>
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle} id={`dropdown-match-${index}`}>
                                        {selections[index].matchType || "Select"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu as={CustomMenu}>
                                        {category.types.map((type, typeIndex) => (
                                            <Dropdown.Item
                                                key={typeIndex}
                                                eventKey={type}
                                                onClick={() => handleSelect(index, 'matchType', type)}
                                            >
                                                {type}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ))}
            <hr />
            <CustomButton onClick={handleFinalizeSelections}>Finalize Selections</CustomButton>
            {showEvaluation && (
                <>
                    <hr />
                    <EvaluationScreen selections={submittedSelections} showEvaluation />
                </>
            )}
        </QuizWindow>

    );
};

export default SelectScreen;
