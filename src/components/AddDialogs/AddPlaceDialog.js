

import { useState, useEffect, forwardRef } from 'react'

import TextField from "@mui/material/TextField";
import SelectLabels from '../Select/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@mui/material/Dialog';
import DataAccessService from '../../Services/DataAccessService';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@mui/material/Slide';
import {DialogActions} from '@mui/material';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { convertCitiesForSelectComponent } from '../../Utils/DataConverterUtils'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Hidden } from '@mui/material';
import  Checkbox  from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function UserEditDialog(props) {
    const { open } = props;
    const { onClose } = props;

    const [entityData, setEntityData] = useState();
    const [selectedCityId, setSelectedCityId] = useState();
    const [cities, setCities] = useState();

    const [loading, setLoading] = useState(true);
    const [saveInProgress, setSaveInProgress] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [fullScreen, setFullScreen] = useState(false);

    
    useEffect(() => {
     
            async function fetchData() {
                var cities = await DataAccessService.getCities();
                setCities(cities);
                console.log(cities);
                setSelectedCityId(cities[0].id)
                setEntityData({
                        id:null,
                        description:"",
                        address:"",
                        isArchived:false,
                        city:selectedCityId,

                })
                console.log("Fetch вызван");
                setLoading(false);
            }
            fetchData();
    }, [open]);

    function handleClose() {
        setEntityData();
        onClose();
        setLoading(true);}

        useEffect(() => {
        if (isSmallScreen) {
          setFullScreen(true);
        } else {
          setFullScreen(false);
    }}, [isSmallScreen]);


    const handleCitySelect = (value) => 
    {
        setSelectedCityId(value);
        console.log(value);
        setEntityData((prevData) => ({
            ...prevData,
            city: value
        }));
    }

    const handleDescriptionChange = (event) => {
       
        setEntityData((prevData) => ({
            ...prevData,
            description: event.target.value
        }));
    }

    const handleIsArchivedChange = (event) => {
        console.log(event.target.checked);
        setEntityData((prevData) => ({
            ...prevData,
            isArchived: event.target.checked
        }));
    }

    const handleAddressChange = (event) => {
        
        setEntityData((prevData) => ({
            ...prevData,
            address: event.target.value
        }));
    }


    const handleSave = async (event) => {
        event.preventDefault();

        

        try {
            setSaveInProgress(true);
            var result = await DataAccessService.addPlace(entityData);
            console.log(result);

            if (result) {               
                
                handleClose();
            }
        } catch (error) {
            console.error('Произошла ошибка при обновлении данных', error);
        } finally {
            // Установка состояния isLoading в false после получения ответа от сервера
            setSaveInProgress(false);
        }
    }

    return (
       
            <Dialog 
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            scroll='paper'
            
            PaperProps={{
                sx:{
                    background:"#333333"
                }
            }}
            
        >
          
            <DialogTitle sx={{ padding: 0 }} id="scroll-dialog-title"><AppBar sx={{ background:"#333333", color:"#EBE5D7", position: 'relative' }}>
                <Hidden smUp>
                <Toolbar sx={{display:"flex", justifyContent:"space-between"}}>
                    <span>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    Редактировать
                    </span>
                    {!loading && <Button color="inherit" type='submit' form="form" >
                        Сохранить
                    </Button>}
                </Toolbar>
                </Hidden>
                <Hidden smDown>
                    <Toolbar>Редактировать</Toolbar></Hidden>
            </AppBar>
            </DialogTitle>
            <DialogContent>
            
                {!loading ? (
                      <form id="form" onSubmit={handleSave}  >
                    <List>
                        <ListItem>
                            <TextField fullWidth required
                                label="Название места"
                                value={entityData.description ? entityData.description : ""}
                                onChange={handleDescriptionChange}
                                InputLabelProps={
                                    {
                                        sx:{
                                            color:"#EBE5D7",
                                            '&.Mui-focused':
                                            {
                                                color:"#EBE5D7",
                                            }
                                        }
                                    }
                                }
                                InputProps={{
                                    sx:{
                                        '& .MuiInputBase-input':
                                        {
                                            color: "#EBE5D7",
                                            fontSize: "14pt",

                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline ':
                                        {
                                            borderColor:"#EBE5D7",
                                        }
                                    },
                                }}
                                
                            />
                        </ListItem>
                        
                        <ListItem>
                            <TextField fullWidth required
                                label="Адрес"
                                value={entityData.address ? entityData.address : ""}
                                onChange={handleAddressChange}
                                InputLabelProps={
                                    {
                                        sx:{
                                            color:"#EBE5D7",
                                            '&.Mui-focused':
                                            {
                                                color:"#EBE5D7",
                                            }
                                        }
                                    }
                                }
                                InputProps={{
                                    sx:{
                                        '& .MuiInputBase-input':
                                        {
                                            color: "#EBE5D7",
                                            fontSize: "14pt",

                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline ':
                                        {
                                            borderColor:"#EBE5D7",
                                        }
                                    },
                                }}
                                
                            />
                        </ListItem>
                                
                        <ListItem>
                            <SelectLabels label="Город" items={convertCitiesForSelectComponent(cities)}
                                value={selectedCityId}
                                onChange={handleCitySelect}
                            />
                        </ListItem>
                        <ListItem >
                                <FormControlLabel sx={{color:'#EBE5D7'}} control={<Checkbox 
                                sx={{color:'#EBE5D7', '&.Mui-checked': {
                                    color: '#EBE5D7', // Задайте нужный цвет для активного состояния
                                  },}}
                                checked={entityData.isArchived} onChange={handleIsArchivedChange}> </Checkbox>} label={<span style={{fontSize:"14pt"}}>Место забыто</span>} />
                                </ListItem>
                    </List></form>) : (<Box sx={{ height: "100%", justifyContent: "center", alignItems: "center", display: 'flex' }}>
                        <CircularProgress sx={{color:"#EBE5D7"}} />    
                    </Box>)}
                    {saveInProgress && (
                    <div
                        style={{
                            position:"absolute",
                            top:0,
                            left:0,
                            width: '100%',
                            height: '100%',
                            zIndex: 9999,
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 9999,
                            }}
                        >
                            <CircularProgress />
                        </div>
                    </div>
                )}
                 
            </DialogContent>
            <Hidden smDown>
            <DialogActions sx={{display:'flex', justifyContent:'space-evenly'}}> 
                
            {!loading &&(<>
            <Button  style={{color:"#EBE5D7"}} onClick={handleClose}>Отмена</Button> 
            <Button style={{color:"#EBE5D7"}} type='submit' form="form" >Сохранить</Button></>)}
            </DialogActions>
            </Hidden>
            
            </Dialog>
        
    )
}

const sex = [
    {
        value: 0,
        label: "Женский"
    },
    {
        value: 1,
        label: "Мужской"
    },
]