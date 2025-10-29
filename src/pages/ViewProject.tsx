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
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';

/** ======= CUSTOM COMPONENTS ======= */
import TaskCard from '../components/TaskCard';
import NoTasks from '../components/NoTasks';
import LayoutContainer from '../components/LayoutContainer';
import PageTitle from '../components/PageTitle';
import DeleteDialog from '../components/DeleteDialog';

/** ======= MUI Icons ======= **/
import { AddIcon, InboxIcon, LazyIcon, SaveIcon, EditIcon, CloseIcon, DeleteIcon } from '../components/LazyIcons';

/** ======= Contexts ======= **/
import { useAuth } from '../contexts/useAuth';
import { useFeedback } from '../contexts/useFeedback';

/** ======= Data & Types ======= **/
import { deleteProject, ProjectWrapper, updateProject } from '../data/Project';
import { columnCards, divCenter } from '../data/Styles';
import { DASHBOARD, NEW_PROJECT, NEW_TASK } from '../data/Routes';
import { type ColumnConfig } from '../data/Types';
import { categoryIcons, dConfig } from '../data/Constants';

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
    const [editing, setEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        if (!user || !userData || !id) return;
        const proj = userData.findProject(id);

        if (!proj) {
            setFeedback('Project not found!', 'error');
            navigate(NEW_PROJECT);
            return;
        }

        setProject(new ProjectWrapper({ ...proj.toFirestore(), tasks: proj.tasks }));
        setDefaultConfig(proj.config);
    }, [user, userData, id, navigate, setFeedback]);
    if (!id) return (<Typography>An ID must be included</Typography>);
    const handleSave = async () => {
        if (!user || !userData || !project) return;

        const original = userData.findProject(id);

        if (!original) return;
        project.config = defaultConfig;

        const equal = original.isEqual(project);

        if (equal) {
            setFeedback('No changes made!', 'info');
            setEditing(false);
            return;
        }

        const response = await updateProject(user.uid, id, project);

        setFeedback(response.success ? 'Project updated!' : `Error: ${response.error}`, response.success ? 'success' : 'error');
        setEditing(false);
    };
    const handleDelete = async () => {
        if (!user || !project) return;
        const response = await deleteProject(user.uid, project.id);

        setFeedback(response.success ? 'Project Deleted!' : `Error deleting project: ${response.error}`, response.success ? 'success' : 'error');
        if (response.success) {
            navigate(DASHBOARD);
        }
        return;
    };
    if (!userData) return;
    return (
        <LayoutContainer backIcon to={DASHBOARD}>
            <PageTitle title={`Dev Board - ${project?.projectName}`} desc={project?.projectDesc} divider />
            <DeleteDialog openDialog={openDialog} setOpenDialog={setOpenDialog} handleDelete={handleDelete} />
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
                                                <Typography variant='inherit' sx={{ display: 'flex', alignItems: 'center' }}><LazyIcon icon={categoryIcons[col.id]} color='primary' sx={{ mr: 1 }} />{col.label}</Typography>
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
                <Fab color="primary" aria-label="add" onClick={() => navigate(NEW_TASK(id))}
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