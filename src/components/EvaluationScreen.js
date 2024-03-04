import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from './CustomButton'; // Ensure this is the correct import for your Button
import { faker } from '@faker-js/faker';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { BallTriangle } from 'react-loading-icons';
const Title = styled.h1`
    font-size: 48px;
`;

const Points = styled.p`
    font-size: 18px;
`;
const evaluationTextMapping = {
    I: {
        I: `You believe nobody completes anyone. You have your own interests, hobbies, and friends, and you might like to keep all that (or some of that) separate—even when you’re together. Being in a partnership doesn’t mean you stop being who you are, self-care and all that. You want to make sure you care for yourselves as much as you care for each other.--EOP-- You and [Compatibility Name] see "I" to "I" when it comes to being a team of sorts. This is the type of connection that makes time feel to relative: no matter how long it's been since you last saw each other, it's like no time passed. Events in your lives sometimes organically overlap, or sometimes you need to reserve a spot in your calendar's empty slot to make sure you can connect. No need to force anything. The two of you meet up whenever is clever, you each have your own worlds that you prefer to keep separate, the only challenge may be to sometimes sacrifice a little me time for more we time.--EOP--It may be the case that [Compatibility Name] is your grounding force outside of your romantic relationships. You and [Compatibility Name] won’t have trouble respecting each other’s need for time alone time, making the times you do meet up more appreciated and cherished, and not to be taken for granted. Keep in mind that the beauty of independent worlds can also be their flaw. If you leave it all to chance you two might drift apart. If you don’t want the friendship to slip away, you’ll need some intentionality. Making the effort to reach out of your private bubbles to connect will ensure the bond stays strong and treasured. --EOP--There's nothing sexier than a little magnetic mystery, and that’s what you can get in a partnership where “I” meets “I”. It makes the shared moment a sacred rendezvous, a treasured glimpse into each other’s secret magical realms. Just be careful not to isolate too much. In order to build a deep connection with [Compatibility Name], you can’t live in 2 separate worlds. You'll need to also make time for each other, building a bond takes some effort. Sacrificing some privacy for quality time with your partner will provide a key ingredient to a thriving partnership.`,
        We: `You believe nobody completes anyone. You have your own interests, hobbies, and friends, and you might like to keep all that (or some of that) separate—even when you’re together. Being in a partnership doesn’t mean you stop being who you are, self-care and all that. You want to make sure you care for yourselves as much as you care for each other.--EOP--Sometimes your need to protect your peace might be at odds with [Compatibility Name]'s need for your time and attention—whether they're a friend, partner, or colleague. where you see boundaries and intrusion, they see opportunities for inclusion, eager to mesh everyone into everything. getting the dynamic you want with [Compatibility Name] means communicating openly, recognizing when you can be flexible, and when to maintain your space.--EOP--Forging a friendship with [Compatibility Name] might be a constant dance between blending and separating. You prefer things to be siloed (family, friendships, partners, etc), and you value your alone time, your own little universe. [Compatibility Name], though? They’re all about gathering the troops by roping everyone together, merging worlds at every chance. This contrast could have two effects on you: you may value their ability to pull you out of your universe; or someimes, you might be overwhelmed by their need to always be making plans. Or maybe a bit of both depending on your mood. Let them know how you're feeling. Showing up for [Compatibility Name] while also subtly establishing your limits can speak volumes in maintaining a balanced friendship.--EOP--The journey with [Compatibility Name] depends on where you both land on the “I” and “we” scales. Knowing yourself is crucial and compromise is key. You’ll have to gauge your willingness to intertwine your worlds and be mindful of how much [Compatibility Name] can adapt to your preference for separation and "you time". It’s not about clinging—“we” individuals just value shared moments more. Ongoing self-reflection to discern where your lines are drawn and where there’s room to bend a little will go a long way.`
    },
    We: {
        I: `You want to create shared memories, be in the moment with your partner. Exploring your different worlds is how you become a part of each other’s lives. For you, quality time is top-tier important. It comes before everything else, otherwise you might feel like, what’s the point of a partnership, ya know?--EOP--Sometimes your openness might make it hard for you to understand [Compatibility Name]'s need for space. You might be wondering, “If i’m always down to have them around, why are they so picky and choosy with me?” It’s not about keeping score and you shouldn’t take it personally. It’s about understanding each other’s comfort zones. Just because you feel at ease bringing them along in your social circles, doesn’t mean they’ll feel the same. That said, you should advocate for your needs, and reflect on how much “we” time you need with [Compatibility Name] either as a friend or a partner.--EOP--Yep, you've got it right, your friend [Compatibility Name] is a little on the private side. Even when you have the same interests, sometimes they'll wanna just do their own thing. And that does not have to be a bad thing. Respect their distance and focus on the quality time you do share. That'll matter more when building a friendship with [Compatibility Name] than how many different social circles and hobbies you share.--EOP--Ok, so, obviously spending time with your partner is vital in a relationship. But being with with someone like [Compatibility Name], it means respecting their need for solitude while expressing your need for togetherness. Now there are extremes, so learn to know when either of you is pushing too far. There's this thing called compromise, and you're going to have a valuable opportunity to work on it in this relatinship. Nothing a good talk can't solve. Advocate for your needs, and hopefully, you and [Compatibility Name] will have a compatible kind of flexibility, a sweet spot where the two of you can find each other between their 'I-ness' and your 'We-ness'. `,
        We: `You want to create shared memories, be in the moment with your partner. Exploring your different worlds is how you become a part of each other’s lives. For you, quality time is top-tier important. It comes before everything else, otherwise you might feel like, what’s the point of a partnership, ya know?--EOP--You and [Compatibility Name] are totally down with a cozy mishmash of groups, whether its family, friends, partners or maybe just the two of you squeezing in as much time together as you can. You know the motto, "The more the merrier", life is one big party everyone is invited to. Just keep an eye out for overdoing the togetherness. There is also value in working a little 'you time' into your busy social calendars. Finding the healthy balance between joinging forces and sometimes rolling solo will keep things fresh and fun.--EOP--Friendship with [Compatibility Name] could look like a never-ending exchange of invites. Their friends. Your friends. It’s one big open club sharing love. Just remember, there’s beauty in boundaries too. Enjoy the continual mixing of worlds, but without some unspoken obligation. You might not always be up for every invite, and that’s totally ok. Embrace the shared experiences but maintain the freedom to opt-out when it suits you. It's not personal!--EOP--With [Compatibility Name], it's quality time whenever is clever. An open buffet of shared experiences. You two will love practicing the art of merging worlds. Your time spent together is just as important as the time you spend in each other's worlds. Just be careful not to smother each other. A little separation is healthy. A solo adventure or a hangout with your bestie without your significant other can be refreshing. And it goes both ways. Mutual understanding and respecting the need for the occasional breather will add extra spice to your shared journey. `,
    }
};
const randomFirstName = faker.person.firstName(); // Generate a random first name


const EvaluationScreen = ({ selections, showEvaluation }) => {
    const [splitText, setSplitText] = useState(null);
    const [geminiInsights, setGeminiInsights] = useState(null);

    const [humanSplitText, setHumanSplitText] = useState(null);

    const randomFirstName = faker.person.firstName(); // Generate a random first name
    const refreshPage = () => window.location.reload();

    const userType = selections.selfType;
    const matchType = selections.matchType;
    //Fetch firestore data to get the evaluation text from evaluation_text collection. Each has a I and We document and I and We field
    const [loading, setLoading] = useState(false);
    const [loadingGemini, setLoadingGemini] = useState(false);

    const maxRetries = 3; // Maximum number of retries
    const evaluationRef = useRef(null);
    const fetchEvaluationText = async (src = 'openai', retryCount) => {

        let url = `${process.env.REACT_APP_API_URL_OPENAI}?userType=${selections.selfType}&matchType=${selections.matchType}&retrieveFromFirestore=true`;
        if (src === 'gemini') {
            url = `${process.env.REACT_APP_API_URL_GEMINI}?userType=${selections.selfType}&matchType=${selections.matchType}&retrieveFromFirestore=false`;
        }

        console.log('Fetching evaluation text...', url, 'retry: ', retryCount);

        try {
            if (src === 'openai') {
                setLoading(true);

            }
            else if (src === 'gemini') {
                setLoadingGemini(true);
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Fetch failed');
            const data = await response.json();
            const placeholderInsights = data.insights
            const insights = []
            placeholderInsights.forEach((insight) => {
                insights.push(insight.replace(/\[Compatibility Name\]/g, `<span style='font-weight: bold;'>${randomFirstName}</span>`));
            });
            console.log('insights', insights);
            // const newText = '[""as]'
            if (src === 'openai') {
                setSplitText(splitEvaluationTextGemini(insights));
                setLoading(false);
            }
            else if (src === 'gemini') {
                setGeminiInsights(splitEvaluationTextGemini(insights));
                setLoadingGemini(false);
            }
            // Simulating a failed fetch
            // throw new Error('Fetch failed');


        } catch (error) {
            console.error('Error fetching evaluation text:', error);
            if (retryCount < maxRetries) {
                // Retry after 2 seconds
                setTimeout(() => {
                    fetchEvaluationText(src, retryCount + 1);
                }, 2000);
            } else {
                console.log('Max retries reached');
                if (src === 'openai') {
                    setLoading(false);
                }
                else if (src === 'gemini') {
                    setLoadingGemini(false);
                }
            }
        }
    };
    useEffect(() => {
        if (showEvaluation && selections.selfType && selections.matchType) {
            console.log('selections.selfType', selections.selfType, 'selections.matchType', selections.matchType, 'showEvaluation', showEvaluation)
            setSplitText(null); // Clear the previous split text
            fetchEvaluationText('openai', 1);
            fetchEvaluationText('gemini', 1);

            const fallbackText = evaluationTextMapping[userType][matchType].replace(/\[Compatibility Name\]/g, `<span style="font-weight: bold;">${randomFirstName}</span>`);
            const newSplitText = splitEvaluationText(fallbackText);
            setHumanSplitText(newSplitText);
        };

    }, [selections.selfType, selections.matchType, showEvaluation]);

    useEffect(() => {
        // Scroll to evaluation text when splitText is set and loading is false
        if (splitText && !loading && evaluationRef.current) {
            evaluationRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [splitText, loading]);
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <Title>Evaluation Results ({userType}-{matchType})</Title>
            <Row className="w-100">
                <Col xs={12} md={4} className="d-flex flex-column align-items-center">
                    <h3>Human Expert Version:</h3>
                    {humanSplitText && <div style={{ textAlign: 'left', backgroundColor: 'white', borderRadius: '10px', padding: '20px', width: '100%' }}>
                        <Points><span dangerouslySetInnerHTML={{ __html: humanSplitText["description"] }} /></Points>
                        <Points><span dangerouslySetInnerHTML={{ __html: humanSplitText["intro"] }} /></Points>
                        <Points><b>AS FRIENDS:</b> <span dangerouslySetInnerHTML={{ __html: humanSplitText["AS FRIENDS:"] }} /></Points>
                        <Points><b>AS PARTNERS:</b> <span dangerouslySetInnerHTML={{ __html: humanSplitText["AS PARTNERS:"] }} /></Points>
                    </div>}
                </Col>
                <Col xs={12} md={4} className="d-flex flex-column align-items-center">
                    <h3 ref={evaluationRef}>AI Version (OpenAI):</h3>
                    {splitText && loading === false ? <div style={{ textAlign: 'left', backgroundColor: 'var(--color-light-green)', borderRadius: '10px', padding: '20px', width: '100%' }}>
                        <Points><span dangerouslySetInnerHTML={{ __html: splitText["description"] }} /></Points>
                        <Points><span dangerouslySetInnerHTML={{ __html: splitText["intro"] }} /></Points>
                        <Points><b>AS FRIENDS:</b> <span dangerouslySetInnerHTML={{ __html: splitText["AS FRIENDS:"] }} /></Points>
                        <Points><b>AS PARTNERS:</b> <span dangerouslySetInnerHTML={{ __html: splitText["AS PARTNERS:"] }} /></Points>
                        <div style={{ textAlign: 'center' }}>
                            <Button style={{ backgroundColor: 'white' }} variant='outline-primary' className='mt-2' onClick={() => { fetchEvaluationText('openai', 0) }}><b>Generate Another</b></Button>
                        </div>

                    </div> : <div style={{ backgroundColor: 'var(--color-light-green)', borderRadius: '10px', padding: '20px', width: '100%' }}
                        className='d-flex flex-column justify-content-center align-items-center'>
                        <BallTriangle height="130" width="130" />
                        <br></br>
                        <h4>Evaluation text is being generated by GPT-4 ...</h4>
                    </div>}

                </Col>
                <Col xs={12} md={4} className="d-flex flex-column align-items-center">
                    <h3 ref={evaluationRef}>AI Version (Google):</h3>
                    {geminiInsights && loadingGemini === false ? <div style={{ textAlign: 'left', backgroundColor: 'var(--color-light-blue2)', borderRadius: '10px', padding: '20px', width: '100%' }}>
                        <Points><span dangerouslySetInnerHTML={{ __html: geminiInsights["description"] }} /></Points>
                        <Points><span dangerouslySetInnerHTML={{ __html: geminiInsights["intro"] }} /></Points>
                        <Points><b>AS FRIENDS:</b> <span dangerouslySetInnerHTML={{ __html: geminiInsights["AS FRIENDS:"] }} /></Points>
                        <Points><b>AS PARTNERS:</b> <span dangerouslySetInnerHTML={{ __html: geminiInsights["AS PARTNERS:"] }} /></Points>
                        <div style={{ textAlign: 'center' }}>
                            <Button style={{ backgroundColor: 'white' }} variant='outline-primary' className='mt-2' onClick={() => { fetchEvaluationText('gemini', 0) }}><b>Generate Another</b></Button>
                        </div>

                    </div> : <div style={{ backgroundColor: 'var(--color-light-blue2)', borderRadius: '10px', padding: '20px', width: '100%' }}
                        className='d-flex flex-column justify-content-center align-items-center'>
                        <BallTriangle height="130" width="130" />
                        <br></br>
                        <h4>Evaluation text is being generated by Gemini ...</h4>
                    </div>}

                </Col>
            </Row>
        </div>


    );

};


function splitEvaluationText(evaluationText) {
    // Split the text into paragraphs based on two newline characters
    let paragraphs = evaluationText.replace('\\n\\n', '--EOP--').replace('\\n', '--EOP--'); // Replace single newlines with '--EOP--' to ensure they are treated as separate paragraphs

    paragraphs = paragraphs.split('--EOP--');

    // Initialize an object to hold the split content
    const splitContent = {
        description: "AI Error",
        intro: "AI Error",
        "AS FRIENDS:": "AI Error",
        "AS PARTNERS:": "AI Error"
    };

    // Assign each paragraph to the appropriate part of splitContent
    // Ensuring that there are at least 4 paragraphs to match the expected structure
    if (paragraphs.length >= 4) {
        splitContent.description = paragraphs[0].trim();
        splitContent.intro = paragraphs[1].trim();
        splitContent["AS FRIENDS:"] = paragraphs[2].trim().startsWith("AS FRIENDS:") ? paragraphs[2].trim().substring("AS FRIENDS:".length).trim() : paragraphs[2].trim();
        splitContent["AS PARTNERS:"] = paragraphs[3].trim().startsWith("AS PARTNERS:") ? paragraphs[3].trim().substring("AS PARTNERS:".length).trim() : paragraphs[3].trim();
    }

    return splitContent;
}

function splitEvaluationTextGemini(evaluationList) {
    // Properly escape double quotes inside the array elements
    console.log('evaluationList before', evaluationList);
    // evaluationText = evaluationText.replace(/"([^"]*?)"/g, (_, match) => `"${match.replace(/"/g, '\\"')}"`);
    console.log('evaluationList after', evaluationList);
    // Initialize an object to hold the split content
    const splitContent = {
        description: "AI Error. Please try again.",
        intro: "AI Error. Please try again.",
        "AS FRIENDS:": "AI Error. Please try again.",
        "AS PARTNERS:": "AI Error. Please try again."
    };

    // Assign each paragraph to the appropriate part of splitContent
    // Ensuring that there are at least 4 paragraphs to match the expected structure
    if (evaluationList.length >= 4) {
        splitContent.description = evaluationList[0].trim()
        splitContent.intro = evaluationList[1].trim()
        splitContent["AS FRIENDS:"] = evaluationList[2].trim()
        splitContent["AS PARTNERS:"] = evaluationList[3].trim()
    }

    return splitContent;
}



export default EvaluationScreen;
