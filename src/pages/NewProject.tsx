/** REACT */

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** AUTH CONTEXT */

import { AuthContext } from '../contexts/AuthContext';

/** MUI COMPONENTS */

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Step from '@mui/material/Step';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { createProject } from '../data/Project';
import { useFeedback } from '../contexts/FeedbackContext';
const steps = ['Project Title', 'Settings & Config'];


const dConfig = [
    { "id": "Long Term", "enabled": true, "label": "Long Term" },
    { "id": "Medium Term", "enabled": true, "label": "Medium Term" },
    { "id": "Short Term", "enabled": true, "label": "Short Term" },
    { "id": "Doing", "enabled": true, "label": "Doing" },
    { "id": "Done", "enabled": true, "label": "Done" }
];


/** NEW JOURNAL PAGE */

const NewJournalPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const { setFeedback } = useFeedback();
    const [defaultConfig, setDefaultConfig] = useState(dConfig);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    });
    const handleSubmit = async () => {
        if (!user) return;

        const projectToCreate = {
            projectName: title,
            projectDesc: desc,
            config: defaultConfig,
        };

        try {
            const response = await createProject(user.uid, projectToCreate);

            if (response.success) {
                // maybe navigate to the new project's page or show success

                setFeedback('Project created with ID: ' + response.data?.id, 'success');
                navigate('/project/' + response.data?.id);
            } else {
                setFeedback('Failed to create project: ' + response.message, 'error');
            }
        } catch (error) {
            setFeedback('Unexpected error creating project.', 'error');
            console.error(error);
        }
    };


    return (
        <Container
            maxWidth="lg"
            sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 6 },
                flexGrow: 1,
            }}>
            <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ mt: 4 }}>
                    {activeStep === 0 && (
                        <>
                            <TextField
                                label="Title"
                                fullWidth
                                margin="normal"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                margin="normal"
                                required
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="contained" onClick={handleNext} disabled={!title || !desc}>
                                    Next
                                </Button>
                            </Box>
                        </>
                    )}

                    {activeStep === 1 && (
                        <Card sx={{ p: 2 }}>
                            <Card elevation={3}>
                                <CardHeader title={
                                    <>
                                        <Typography variant='inherit'>Config</Typography>
                                        <Divider sx={{ mt: 2 }} />
                                    </>
                                } />
                                <CardContent>
                                    <Stack spacing={2}>
                                        {defaultConfig.map((config) => {
                                            return <>
                                                <FormControlLabel
                                                    key={config.id}
                                                    control={
                                                        <Checkbox
                                                            checked={config.enabled}
                                                            onChange={() =>
                                                                setDefaultConfig((prev) =>
                                                                    prev.map((c) =>
                                                                        c.id === config.id ? { ...c, enabled: !c.enabled } : c
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={`Enable ${config.label}`} />
                                                <Collapse in={config.enabled} timeout={{ enter: 350, exit: 350 }}>
                                                    <TextField
                                                        label={config.id}
                                                        fullWidth
                                                        required
                                                        value={config.label}
                                                        onChange={(e) =>
                                                            setDefaultConfig((prev) =>
                                                                prev.map((c) =>
                                                                    c.id === config.id ? { ...c, label: e.target.value } : c
                                                                )
                                                            )
                                                        }
                                                        sx={{ mt: 2 }}
                                                    />
                                                </Collapse>
                                            </>;
                                        })}
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button variant="outlined" onClick={handleBack}>Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Card>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default NewJournalPage;