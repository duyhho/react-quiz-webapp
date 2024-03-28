import React, { useState, useEffect } from 'react';
import { Collapse, Button, Card, Container, Col, Row, Carousel } from 'react-bootstrap';
import { evaluationTextMapping } from './defaultMapping';
import { categories } from './SelectScreen';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebase';

const Examples = () => {
    const [openKeys, setOpenKeys] = useState({});
    const [versions, setVersions] = useState({});

    useEffect(() => {
        const fetchVersions = async () => {
            const versionsData = {};
            for (const category of categories) {
                for (const key of category.keys) {
                    const versionsRef = collection(firestore, key);
                    const versionsSnapshot = await getDocs(versionsRef);
                    const versionsList = [];
                    versionsSnapshot.forEach((doc) => {
                        versionsList.push(doc.data());
                    });
                    versionsData[key] = versionsList;
                }
            }
            setVersions(versionsData);
        };
        fetchVersions();

        const unsubscribe = {};
        for (const category of categories) {
            for (const key of category.keys) {
                const versionsRef = collection(firestore, key);
                unsubscribe[key] = onSnapshot(versionsRef, (snapshot) => {
                    const versionsList = [];
                    snapshot.forEach((doc) => {
                        versionsList.push(doc.data());
                    });
                    setVersions((prevVersions) => ({
                        ...prevVersions,
                        [key]: versionsList,
                    }));
                });
            }
        }

        return () => {
            for (const key in unsubscribe) {
                if (unsubscribe.hasOwnProperty(key)) {
                    unsubscribe[key]();
                }
            }
        };
    }, []);

    const toggleCollapse = (key) => {
        setOpenKeys((prevOpenKeys) => ({
            ...prevOpenKeys,
            [key]: !prevOpenKeys[key],
        }));
    };
    useEffect(() => {
        console.log("versions", versions)
    }, [versions])
    return (
        <Container fluid className="evaluation-page mt-2">
            <div className='text-center'><h3>Existing Examples</h3></div>
            {categories.map((category) => (
                <Card key={category.name} className="mb-3">
                    <Card.Header>
                        <Button
                            variant="link"
                            onClick={() => toggleCollapse(category.name)}
                            aria-controls={category.name}
                            aria-expanded={openKeys[category.name]}
                        >
                            {category.name} <span className="arrow" style={{ color: 'var(--color-warm-orange)' }}>
                                {openKeys[category.name] ? '▼' : '➤'}
                            </span>
                        </Button>
                    </Card.Header>
                    <Collapse in={openKeys[category.name]}>
                        <Card.Body id={category.name}>
                            {category.keys.map((key) => (
                                <div key={key}>
                                    <Button
                                        variant="link"
                                        onClick={() => toggleCollapse(key)}
                                        aria-controls={key}
                                        aria-expanded={openKeys[key]}
                                    >
                                        {key} <span className="arrow" style={{ color: 'var(--color-warm-orange)' }}>
                                            {openKeys[key] ? '▼' : '➤'}
                                        </span>
                                    </Button>
                                    <Collapse in={openKeys[key]}>
                                        <Card.Body id={key}>
                                            <Row>
                                                <Col md='6'>
                                                    <div className='text-center mb-1'><b>Human Version</b></div>

                                                    {evaluationTextMapping[key].insights.map((insight, index) => (
                                                        <p style={{ fontSize: 18 }} key={index}>{insight}</p>
                                                    ))}
                                                </Col>
                                                <Col md='6'>
                                                    {versions[key] && versions[key].length > 0 && (
                                                        <Carousel className="custom-carousel" >
                                                            {versions[key].map((version, index) => (
                                                                <Carousel.Item key={index} style={{ marginBottom: 100 }}>
                                                                    <div style={{ fontSize: 18 }}>
                                                                        <div style={{ fontSize: 22 }} className='text-center mb-1'><b>Version {index + 1} (ID: {version.id})</b></div>
                                                                        <p>{version.insights.description}</p>
                                                                        <p>{version.insights.intro}</p>
                                                                        <p>{version.insights.friendship}</p>
                                                                        <p>{version.insights.partnership}</p>
                                                                    </div>
                                                                </Carousel.Item>
                                                            ))}
                                                        </Carousel>
                                                    )}
                                                    {(!versions[key] || versions[key].length === 0) && (
                                                        <div className='text-center'><b>No AI-Generated Content Yet</b></div>
                                                    )}

                                                </Col>
                                            </Row>


                                        </Card.Body>
                                    </Collapse>
                                </div>
                            ))}
                        </Card.Body>
                    </Collapse>
                </Card>
            ))}
        </Container>
    );
};
export default Examples;