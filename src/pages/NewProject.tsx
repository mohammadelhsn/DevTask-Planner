/** REACT */
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** CONTEXTS */
import { AuthContext } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** FIREBASE */
import { createProject } from '../data/Project';
import { DASHBOARD, VIEW_PROJECT } from '../data/Routes';

/** MUI COMPONENTS */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import type { ColumnConfig } from '../data/Types';
import LayoutContainer from '../components/LayoutContainer';


const steps = ['Project Title', 'Settings & Config'];


const dConfig: ColumnConfig[] = [
    { "id": "Uncategorized", "enabled": true, "label": "Uncategorized" },
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
    const [defaultConfig, setDefaultConfig] = useState<ColumnConfig[]>(dConfig);
    const { user, loading } = useContext(AuthContext);
    /** NAVIGATION HOOK */
    const navigate = useNavigate();
    const navigateToViewProject = (id: string) => navigate(VIEW_PROJECT(id));
    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
    const handleSubmit = async () => {
        if (!user) return;

        const projectToCreate = {
            projectName: title,
            projectDesc: desc,
            config: defaultConfig,
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await createProject(user.uid, projectToCreate);

            if (response.success) {
                setFeedback('Project created with ID: ' + response.data?.id, 'success');
                if (response && response.data) {
                    navigateToViewProject(response.data.id);
                }
            } else {
                setFeedback('Failed to create project: ' + response.message, 'error');
            }
        } catch (error) {
            setFeedback('Unexpected error creating project.', 'error');
            console.error(error);
        }
    };
    return (
        <Fade in={!loading} timeout={500}>
            <div>
                <LayoutContainer backIcon to={DASHBOARD}>
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
                                                {defaultConfig.map((config, index) => {
                                                    const isUncategorized = config.id === 'Uncategorized';
                                                    return (
                                                        <Box key={`${config.id}-${index}`}>
                                                            <FormControlLabel
                                                                name={config.id}
                                                                control={
                                                                    <Checkbox
                                                                        checked={config.enabled}
                                                                        onChange={() =>
                                                                            !isUncategorized && setDefaultConfig((prev) =>
                                                                                prev.map((c) =>
                                                                                    c.id === config.id ? { ...c, enabled: !c.enabled } : c
                                                                                )
                                                                            )
                                                                        }
                                                                        disabled={isUncategorized}
                                                                    />
                                                                }
                                                                label={`Enable ${config.id}`}
                                                            />
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
                                                                    disabled={isUncategorized}
                                                                />
                                                            </Collapse>
                                                        </Box>
                                                    );
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
                </LayoutContainer>
            </div>
        </Fade>
    );
};

export default NewJournalPage;