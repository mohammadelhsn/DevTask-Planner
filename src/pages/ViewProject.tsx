/** ======= React & Router ======= **/
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** ======= MUI Components ======= **/
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

/** ======= MUI Icons ======= **/
import { ScheduleIcon, EventIcon, FlashOnIcon, AutorenewIcon, CheckCircleIcon, AddIcon, InboxIcon, LazyIcon, SaveIcon, EditIcon, CloseIcon, DeleteIcon } from '../components/LazyIcons';
import Fab from '@mui/material/Fab';

/** ======= Contexts ======= **/
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';

/** ======= Project-specific Imports ======= **/
import { deleteProject, ProjectWrapper, updateProject } from '../data/Project';
import { columnCards, divCenter } from '../data/Styles';
import { DASHBOARD, NEW_PROJECT } from '../data/Routes';
import TaskCard from '../components/TaskCard';
import NoTasks from '../components/NoTasks';
import type { ColumnConfig, ColumnType, LazyIconType } from '../data/Types';
import LayoutContainer from '../components/LayoutContainer';
import PageTitle from '../components/PageTitle';
import { CardActions } from '@mui/material';

const icons: Record<Exclude<ColumnType, null>, LazyIconType> = {
    "Uncategorized": InboxIcon,
    "Long Term": ScheduleIcon,
    "Medium Term": EventIcon,
    "Short Term": FlashOnIcon,
    "Doing": AutorenewIcon,
    "Done": CheckCircleIcon
};

const dConfig: ColumnConfig[] = [
    { "id": "Uncategorized", "enabled": true, "label": "Uncategorized" },
    { "id": "Long Term", "enabled": true, "label": "Long Term" },
    { "id": "Medium Term", "enabled": true, "label": "Medium Term" },
    { "id": "Short Term", "enabled": true, "label": "Short Term" },
    { "id": "Doing", "enabled": true, "label": "Doing" },
    { "id": "Done", "enabled": true, "label": "Done" }
];


const ViewProject = () => {
    /** ======= GET AUTH STATE ======= */
    const { user, userData } = useAuth();
    /** ======= GET THE GLOBAL SNACKBAR CONTEXT ======= */
    const { setFeedback } = useFeedback();
    const [defaultConfig, setDefaultConfig] = useState<ColumnConfig[]>(dConfig);
    /** ======= GET URL PARAMS */
    const { id } = useParams();
    /** ======= DEFINE STATE FOR PROJECT ======= */
    const [project, setProject] = useState<ProjectWrapper | null>(null);
    /**  */
    const navigate = useNavigate();
    const navigateToNewProject = () => navigate(NEW_PROJECT);
    const [editing, setEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        if (user && userData) {
            if (id) {
                const proj = userData.findProject(id);
                if (proj) {
                    // this is making a copy
                    setProject(new ProjectWrapper({ ...proj.toFirestore(), tasks: proj.tasks }));
                    setDefaultConfig(proj.config);
                } else {
                    setFeedback('Project not found!', 'error');
                    navigateToNewProject();
                    return;
                }
            }
        }
    }, [user, userData, id]);
    if (!id) return (<Typography>An ID must be included</Typography>);
    const handleSave = async () => {
        if (!user || !userData) return;
        const original = userData.findProject(id);
        if (!original) return;
        if (project) {
            project.config = defaultConfig;
            const equal = original.isEqual(project);
            if (equal) {
                setFeedback('No changes made!', 'info');
            } else {
                const response = await updateProject(user.uid, id, project);
                if (response.success) {
                    setFeedback('Project updated!', 'success');
                } else {
                    setFeedback(`Error: ${response.error}`, 'error');
                }
            }
        }
        setEditing(false);
    };
    const handleDelete = async () => {
        if (!user) return;
        if (!project) return;
        const response = await deleteProject(user.uid, project.id);

        if (response.success) {
            setFeedback('Project deleted!', 'success');
            navigate(DASHBOARD);
        } else {
            setFeedback(`Error deleting project: ${response.error}`, 'error');
        }
    };
    if (!userData) return;
    return (
        <LayoutContainer backIcon>
            <PageTitle title={`Dev Board - ${project?.projectName}`} desc={project?.projectDesc} divider />
            <Dialog open={openDialog}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={DeleteIcon} color='error' sx={{ mr: 1 }} />Delete Journal</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} >Close</Button>
                    <Button variant='contained' onClick={handleDelete} color='error'>Delete</Button>
                </DialogActions>
            </Dialog>
            {editing && (
                <Card sx={{ p: 2 }}>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        required
                        value={project?.projectName}
                        onChange={(e) => setProject((prev) => {
                            if (prev) {
                                return new ProjectWrapper({ ...prev, createdAt: prev.createdAt.toISOString(), lastUpdated: new Date().toISOString(), projectName: e.target.value });
                            } else {
                                return prev;
                            }
                        })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        required
                        value={project?.projectDesc}
                        onChange={(e) => setProject((prev) => {
                            if (prev) {
                                return new ProjectWrapper({ ...prev, createdAt: prev.createdAt.toISOString(), lastUpdated: new Date().toISOString(), projectDesc: e.target.value });
                            } else {
                                return prev;
                            }
                        })}
                    />
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                        {project && defaultConfig.map((config, index) => {
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
                    <CardActions>
                        <Button startIcon={<LazyIcon icon={CloseIcon} />} onClick={() => setEditing(false)}>Cancel</Button>
                        <Button startIcon={<LazyIcon icon={DeleteIcon} />} color='error' onClick={() => setOpenDialog(true)}>Delete</Button>
                    </CardActions>
                </Card>
            )}
            {!editing && (
                <Paper sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                    {project && project.tasks.length == 0 && (
                        <Box p={2} sx={{ ...divCenter }}>
                            <LazyIcon icon={InboxIcon} fontSize='large' color='primary' sx={{ mr: 1 }} />
                            <Typography variant="h6" color="text.secondary">No tasks in this project yet</Typography>
                        </Box>
                    )}
                    {project && project.tasks.length > 0 && (
                        <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, minWidth: { xs: 'auto', sm: 'fit-content' }, }}>
                            {project.config.map((col, index) => {
                                const columnTasks = project.tasks.filter((t) => t.column === col.id);
                                return (
                                    <Card elevation={3} sx={columnCards} key={`${col.id}-${index}-ViewProject`}>
                                        <CardHeader title={
                                            <>
                                                <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={icons[col.id]} color='primary' sx={{ mr: 1 }} />{col.label}</Typography>
                                                <Divider sx={{ mt: 1 }} />
                                            </>
                                        } />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                {columnTasks.length === 0 ? <NoTasks /> : columnTasks.map((t, index) => {
                                                    return (<TaskCard t={t} key={`${t.id}-${index}-ViewProject`} projectId={id} />);
                                                })}
                                            </Stack>
                                        </CardContent>
                                    </Card>);
                            })}
                        </Stack>
                    )}
                </Paper>
            )}

            <Box sx={{
                position: 'fixed',
                bottom: 120,
                right: 24,
                zIndex: 1000,
            }}>
                <Box sx={{
                    position: 'fixed',
                    bottom: 60, // slightly above the task add FAB
                    right: 24,
                    zIndex: 999,
                }}>
                    <Fab size="small" color="secondary" onClick={editing ? handleSave : () => setEditing(true)}>
                        <LazyIcon icon={editing ? SaveIcon : EditIcon} />
                    </Fab>
                </Box>
                <Fab color="primary" aria-label="add" onClick={() => navigate(`/project/${id}/tasks/new`)}
                    sx={{
                        '&:hover .spin-icon': {
                            transform: 'rotate(180deg) scale(1.2)',
                            transition: 'transform 0.3s ease',
                        },
                        transition: '0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.2)'
                        }
                    }}
                >
                    <LazyIcon icon={AddIcon} className="spin-icon" sx={{
                        transition: 'transform 0.8s ease',
                        transformOrigin: 'center',
                    }} />
                </Fab>
            </Box>
        </LayoutContainer>
    );
};

export default ViewProject;