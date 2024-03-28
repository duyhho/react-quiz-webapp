import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from './CustomButton'; // Ensure this is the correct import for your Button
import { faker, th } from '@faker-js/faker';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { BallTriangle } from 'react-loading-icons';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { evaluationTextMapping } from './defaultMapping';
import { firestore } from './firebase';
import Carousel from 'react-bootstrap/Carousel';
import { categories } from './SelectScreen';
const Title = styled.h1`
    font-size: 48px;
`;

const Points = styled.p`
    font-size: 18px;
`;

const randomFirstName = faker.person.firstName(); // Generate a random first name

const EvaluationScreen = ({ selections, showEvaluation }) => {
    console.log('selections', selections);
    const [splitText, setSplitText] = useState(null);
    const [geminiInsights, setGeminiInsights] = useState([]);

    const [humanSplitText, setHumanSplitText] = useState([]);

    const randomFirstName = faker.person.firstName(); // Generate a random first name
    const [isEditing, setIsEditing] = useState(false);
    const [editableIndex, setEditableIndex] = useState(null);

    const [editableContent, setEditableContent] = useState({
        description: '',
        intro: '',
        friends: '',
        partners: ''
    });

    //Fetch firestore data to get the evaluation text from evaluation_text collection. Each has a I and We document and I and We field
    const [loading, setLoading] = useState(false);
    const [loadingGemini, setLoadingGemini] = useState(false);

    const maxRetries = 3; // Maximum number of retries
    const evaluationRef = useRef(null);
    const geminiEvaluationRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const fetchEvaluationText = async (src = 'openai', retryCount, selfType, matchType, index) => {
        let url = `${process.env.REACT_APP_API_URL_OPENAI}?userType=${selfType}&matchType=${matchType}&retrieveFromFirestore=true`;
        if (src === 'gemini') {
            url = `${process.env.REACT_APP_API_URL_GEMINI}?userType=${selfType}&matchType=${matchType}&retrieveFromFirestore=false`;
        }

        console.log('Fetching evaluation text...', url, 'retry: ', retryCount);

        try {
            if (src === 'openai') {
                setLoading(true);
            } else if (src === 'gemini') {
                setLoadingGemini(true);
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Fetch failed');
            const data = await response.json();
            const placeholderInsights = data.insights;
            const insights = placeholderInsights.map((insight) =>
                // insight.replace(/\[Compatibility Name\]/g, `<span style='font-weight: bold;'>${randomFirstName}</span>`)
                insight
            );

            console.log('insights', src, insights);
            if (insights.length < 4) {
                throw new Error('Insights do not have the correct length');
            }

            if (src === 'openai') {
                setSplitText(splitEvaluationTextGemini(insights));
                setLoading(false);
            } else if (src === 'gemini') {
                const newInsights = splitEvaluationTextGemini(insights);
                setGeminiInsights((prevInsights) => {
                    const updatedInsights = [...prevInsights];
                    updatedInsights[index] = newInsights;
                    return updatedInsights;
                });
                setLoadingGemini(false);
            }
        } catch (error) {
            console.error('Error fetching evaluation text:', error);
            if (retryCount < maxRetries) {
                setTimeout(() => {
                    console.log('Retrying...');
                    fetchEvaluationText(src, retryCount + 1, selfType, matchType, index);
                }, 2000);
            } else {
                console.log('Max retries reached');
                if (src === 'openai') {
                    setLoading(false);
                } else if (src === 'gemini') {
                    setLoadingGemini(false);
                }
            }
        }
    };

    const handleEdit = (index) => {
        setIsEditing(true);
        setEditableIndex(index); // Store the index of the item being edited
        setEditableContent({
            description: geminiInsights[index]["description"],
            intro: geminiInsights[index]["intro"],
            friends: geminiInsights[index]["friendship"],
            partners: geminiInsights[index]["partnership"]
        });
    };
    const handleSave = () => {
        const updatedGeminiInsights = [...geminiInsights];
        updatedGeminiInsights[editableIndex] = {
            ...updatedGeminiInsights[editableIndex],
            "description": editableContent.description,
            "intro": editableContent.intro,
            "friendship": editableContent.friends,
            "partnership": editableContent.partners
        };
        setGeminiInsights(updatedGeminiInsights);

        // Save the changes to Firebase
        // (You'll need to implement the logic for saving to Firebase)

        setIsEditing(false); // Exit editing mode
        setEditableIndex(null); // Reset the editable index
    };


    useEffect(() => {
        if (showEvaluation) {
            const updatedHumanSplitText = selections.map((selection) => {
                if (selection.selfType && selection.matchType) {
                    console.log('selection.selfType', selection.selfType, 'selection.matchType', selection.matchType);
                    const placeholderInsights = evaluationTextMapping[`${selection.selfType.toLowerCase()}-${selection.matchType.toLowerCase()}`].insights;
                    const fallbackInsights = placeholderInsights.map((insight) =>
                        // insight.replace(/\[Compatibility Name\]/g, `<span style='font-weight: bold;'>${randomFirstName}</span>`)
                        insight
                        // console.log('')
                    );
                    return splitEvaluationTextGemini(fallbackInsights);
                } else {
                    return null;
                }
            });
            setHumanSplitText(updatedHumanSplitText);
        }
    }, [selections, showEvaluation]);
    useEffect(() => {
        if (showEvaluation) {
            selections.forEach(async (selection, index) => {
                if (selection.selfType && selection.matchType) {
                    await fetchEvaluationText('gemini', 1, selection.selfType, selection.matchType, index);
                }
                // const updatedHumanSplitText = selections.map((selection) => {
                //     if (selection.selfType && selection.matchType) {
                //         console.log('selection.selfType', selection.selfType, 'selection.matchType', selection.matchType);
                //         const placeholderInsights = evaluationTextMapping[`${selection.selfType.toLowerCase()}-${selection.matchType.toLowerCase()}`].insights;
                //         const fallbackInsights = placeholderInsights.map((insight) =>
                //             // insight.replace(/\[Compatibility Name\]/g, `<span style='font-weight: bold;'>${randomFirstName}</span>`)
                //             insight
                //         );
                //         return splitEvaluationTextGemini(fallbackInsights);
                //     } else {
                //         return null;
                //     }
                // });
                // setGeminiInsights(updatedHumanSplitText);
            });
        }
    }, [selections, showEvaluation]);


    useEffect(() => {
        // Scroll to evaluation text when splitText is set and loading is false
        if (splitText && !loading && evaluationRef.current) {
            evaluationRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [splitText, loading]);
    useEffect(() => {
        // Scroll to evaluation text when splitText is set and loading is false
        if (geminiInsights && !loadingGemini && geminiEvaluationRef.current) {
            geminiEvaluationRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [geminiInsights, loadingGemini]);

    const [openaiFeedback, setOpenaiFeedback] = useState('');
    const [geminiFeedback, setGeminiFeedback] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleFeedbackSubmit = async (event, index) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const feedbackType = event.target.id; // Get the feedback type (openai or gemini)

        const feedbackText = feedbackType === "openai" ? openaiFeedback : geminiFeedback;
        console.log('feedbackType', feedbackType)
        // if (!feedbackText.trim()) {
        //     setAlertMessage("Please enter some feedback before submitting.");
        //     setShowAlert(true);
        //     return;
        // }

        try {
            const feedbackDoc = feedbackType === "openai" ? "feedback_openai" : "feedback_gemini";
            const selection = selections[index]; // Get the selection at the current index
            const collectionName = `${selection.selfType.toLowerCase()}-${selection.matchType.toLowerCase()}`; // Collection name based on selection types
            const id = makeId(4); // Generate a random ID of length 10

            const objectToWrite = {
                id: id, // Include the generated ID
                feedback: feedbackText,
                createdAt: new Date(),
                selection: selections[index],
                insights: feedbackType === "openai" ? splitText[index] : geminiInsights[index]
            };
            console.log('objectToWrite', objectToWrite);
            // Create a document reference with the generated ID
            const docRef = doc(firestore, collectionName, id);

            // Set the document with the specified ID
            await setDoc(docRef, objectToWrite);

            // Clear the feedback form and show a success message
            feedbackType === "openai" ? setOpenaiFeedback('') : setGeminiFeedback('');
            setShowAlert(true);
            setAlertMessage(`Thank you for your feedback! The entry has been saved in the system.`);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setAlertMessage("An error occurred while submitting your feedback. Please try again later.");
            setShowAlert(true);
        }

    };


    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <Title>Evaluation Results</Title>
            {/* {showAlert && (
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )} */}
            <Modal show={showAlert} onHide={() => setShowAlert(false)} centered >
                <Modal.Header closeButton style={{
                    backgroundColor: alertMessage.toLowerCase().includes('error') ? '#dc3545' : 'var(--color-light-green)',
                    color: 'white',
                    fontSize: '16px'
                }} >
                </Modal.Header>
                <Modal.Body style={{
                    textAlign: 'center',
                    backgroundColor: alertMessage.toLowerCase().includes('error') ? '#dc3545' : 'var(--color-light-green)',
                    color: 'black',
                    // fontSize: '18px'
                }} >
                    {alertMessage}
                </Modal.Body>
                <Modal.Footer style={{
                    textAlign: 'center',
                    backgroundColor: alertMessage.toLowerCase().includes('error') ? '#dc3545' : 'var(--color-light-green)',
                    color: 'black',
                    // fontSize: '18px'
                }} />
            </Modal>
            <Carousel className="custom-carousel" keyboard={true} fade indicators indicatorLabels={Object.keys(categories)} interval={null} >
                {selections.map((selection, index) => (
                    <Carousel.Item key={index}

                    >
                        <div key={index} style={{ marginBottom: 100 }}>
                            <h4>{selection.selfType} - {selection.matchType} Category:</h4>
                            <Row className="w-100">
                                <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                                    <h4>Human Expert Version:</h4>
                                    {humanSplitText[index] && (
                                        <div style={{
                                            textAlign: 'left', backgroundColor: 'white',
                                            borderRadius: '10px', padding: '20px', width: '100%',
                                            fontSize: 20
                                        }}>
                                            <p dangerouslySetInnerHTML={{ __html: humanSplitText[index]["description"] }} />
                                            <p dangerouslySetInnerHTML={{ __html: humanSplitText[index]["intro"] }} />
                                            <p><b>AS FRIENDS:</b> <span dangerouslySetInnerHTML={{ __html: humanSplitText[index]["friendship"] }} /></p>
                                            <p><b>AS PARTNERS:</b> <span dangerouslySetInnerHTML={{ __html: humanSplitText[index]["partnership"] }} /></p>
                                        </div>
                                    )}
                                </Col>

                                <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                                    <h4 ref={geminiEvaluationRef}>AI Version (Google):</h4>
                                    {geminiInsights[index] && loadingGemini === false ? (
                                        <div style={{
                                            textAlign: 'left', fontSize: 20,
                                            backgroundColor: 'var(--color-light-blue2)', borderRadius: '10px', padding: '20px', width: '100%'
                                        }}>
                                            {isEditing && editableIndex === index ? (
                                                <>
                                                    <Form.Group>
                                                        <Form.Label>Description:</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={8}
                                                            value={editableContent.description}
                                                            onChange={(e) => setEditableContent({ ...editableContent, description: e.target.value })}
                                                        />
                                                    </Form.Group>

                                                    <Form.Group>
                                                        <Form.Label>Intro:</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={8}
                                                            value={editableContent.intro}
                                                            onChange={(e) => setEditableContent({ ...editableContent, intro: e.target.value })}
                                                        />
                                                    </Form.Group>

                                                    <Form.Group>
                                                        <Form.Label>As Friends:</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={8}
                                                            value={editableContent.friends}
                                                            onChange={(e) => setEditableContent({ ...editableContent, friends: e.target.value })}
                                                        />
                                                    </Form.Group>

                                                    <Form.Group>
                                                        <Form.Label>As Partners:</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={8}
                                                            value={editableContent.partners}
                                                            onChange={(e) => setEditableContent({ ...editableContent, partners: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <div style={{ textAlign: 'center', marginTop: 3 }}>
                                                        <Button className="me-2" onClick={handleSave}>Save</Button>
                                                        <Button variant="secondary" onClick={() => { setIsEditing(false); setEditableIndex(null); }}>Cancel</Button>
                                                    </div>
                                                </>

                                            ) : (
                                                <>
                                                    <p dangerouslySetInnerHTML={{ __html: geminiInsights[index]["description"] }} />
                                                    <p dangerouslySetInnerHTML={{ __html: geminiInsights[index]["intro"] }} />
                                                    <p><b>AS FRIENDS:</b> <span dangerouslySetInnerHTML={{ __html: geminiInsights[index]["friendship"] }} /></p>
                                                    <p><b>AS PARTNERS:</b> <span dangerouslySetInnerHTML={{ __html: geminiInsights[index]["partnership"] }} /></p>
                                                    <div style={{ textAlign: 'center', marginTop: 3 }} >
                                                        <Button className='me-2' onClick={() => handleEdit(index)}>Edit</Button>
                                                        <Button style={{ backgroundColor: 'white' }} variant='outline-primary' onClick={() => { fetchEvaluationText('gemini', 0, selection.selfType, selection.matchType, index) }}><b>Generate Another</b></Button>
                                                    </div>
                                                </>
                                            )}


                                            {/* Feedback Form */}
                                            <Form className="mt-3 text-center" onSubmit={(e) => handleFeedbackSubmit(e, index)} id='gemini'>
                                                <Form.Group className="mb-3" controlId="geminiFeedback">
                                                    <Form.Label>Your Feedback (if any):</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="E.g: Less metaphor, more direct, etc."
                                                        style={{ fontSize: '16px' }}
                                                        value={geminiFeedback}
                                                        onChange={(e) => setGeminiFeedback(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                // disabled={!geminiFeedback.trim()}
                                                >
                                                    Submit Feedback
                                                </Button>
                                            </Form>
                                        </div>
                                    ) : (
                                        <div style={{ backgroundColor: 'var(--color-light-blue2)', borderRadius: '10px', padding: '20px', width: '100%' }}
                                            className='d-flex flex-column justify-content-center align-items-center'>
                                            <BallTriangle height="130" width="130" />
                                            <br></br>
                                            <h4>Evaluation text is being generated by Gemini ...</h4>
                                        </div>
                                    )}
                                </Col>

                            </Row>
                        </div>
                    </Carousel.Item>
                ))}


            </Carousel>

        </div >


    );

};


function splitEvaluationTextGemini(evaluationList) {
    // Properly escape double quotes inside the array elements
    console.log('evaluationList before', evaluationList);
    // evaluationText = evaluationText.replace(/"([^"]*?)"/g, (_, match) => `"${match.replace(/"/g, '\\"')}"`);
    console.log('evaluationList after', evaluationList);
    // Initialize an object to hold the split content
    const splitContent = {
        description: "AI Error. Please try again.",
        intro: "AI Error. Please try again.",
        "friendship": "AI Error. Please try again.",
        "partnership": "AI Error. Please try again."
    };

    // Assign each paragraph to the appropriate part of splitContent
    // Ensuring that there are at least 4 paragraphs to match the expected structure
    if (evaluationList.length >= 4) {
        splitContent.description = evaluationList[0].trim()
        splitContent.intro = evaluationList[1].trim()
        splitContent["friendship"] = evaluationList[2].trim()
        splitContent["partnership"] = evaluationList[3].trim()
    }

    return splitContent;
}



export default EvaluationScreen;
function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
