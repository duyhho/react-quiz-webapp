import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from './Button'; // Ensure this is the correct import for your Button
import { faker } from '@faker-js/faker';
import { Container } from 'react-bootstrap';
import { BallTriangle } from 'react-loading-icons';
const Title = styled.h1`
    font-size: 48px;
`;

const Points = styled.p`
    font-size: 24px;
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


const GameOver = ({ selections }) => {
    const [splitText, setSplitText] = useState(null);

    const refreshPage = () => window.location.reload();
    const randomFirstName = faker.person.firstName(); // Generate a random first name

    const userType = selections.selfType;
    const matchType = selections.matchType;
    //Fetch firestore data to get the evaluation text from evaluation_text collection. Each has a I and We document and I and We field

    useEffect(() => {
        const fetchEvaluationText = async () => {

            const url = `${process.env.REACT_APP_API_URL}?userType=${userType}&matchType=${matchType}`;
            console.log('Fetching evaluation text...', url);

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Fetch failed');
                const data = await response.json();
                // const data = null; //test default
                // Assume `data.answer` contains the full evaluation text to be split

                const newText = data.answer.replace(/\[Compatibility Name\]/g, `<span style="font-weight: bold;">${randomFirstName}</span>`);
                setSplitText(splitEvaluationText(newText));

                console.log('splitText', newText)

            } catch (error) {
                console.error('Falling back to local evaluationTextMapping due to:', error);
                const fallbackText = evaluationTextMapping[userType][matchType].replace(/\[Compatibility Name\]/g, `<span style="font-weight: bold;">${randomFirstName}</span>`);
                console.log('fallbackText', fallbackText)
                const newSplitText = splitEvaluationText(fallbackText)
                console.log('newSplitText', newSplitText)
                setSplitText(newSplitText);
            }
        };

        fetchEvaluationText();
    }, [selections.selfType, selections.matchType]); // Re-run if selections change
    if (!splitText) return <Container className="vh-100 d-flex flex-column justify-content-center align-items-center">
        <BallTriangle height="130" width="130" />
    </Container>

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center"
            style={{ paddingTop: 90, paddingBottom: 15, backgroundColor: "var(--color-warm-orange)" }}>
            <Title>Evaluation Results ({userType}-{matchType})</Title>
            {/* <Points>You identify as an "{selections.selfType}" person.</Points> */}
            {/* <Points>You are looking for a "{selections.matchType}" person.</Points> */}
            <Points><span dangerouslySetInnerHTML={{ __html: splitText["description"] }} /></Points>
            <Points><span dangerouslySetInnerHTML={{ __html: splitText["intro"] }} /></Points>
            <Points><b>AS FRIENDS:</b> <span dangerouslySetInnerHTML={{ __html: splitText["AS FRIENDS:"] }} /></Points>
            <Points><b>AS PARTNERS:</b> <span dangerouslySetInnerHTML={{ __html: splitText["AS PARTNERS:"] }} /></Points>
            <Button onClick={refreshPage}><b>Retry</b></Button>
        </Container>
    );

};


function splitEvaluationText(evaluationText) {
    // Split the text into paragraphs based on two newline characters
    let paragraphs = evaluationText.replace('\\n\\n', '--EOP--').replace('\\n', '--EOP--'); // Replace single newlines with '--EOP--' to ensure they are treated as separate paragraphs

    paragraphs = paragraphs.split('--EOP--');

    // Initialize an object to hold the split content
    const splitContent = {
        description: "",
        intro: "",
        "AS FRIENDS:": "",
        "AS PARTNERS:": ""
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


export default GameOver;
