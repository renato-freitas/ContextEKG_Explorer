import { useState, useEffect, useContext, KeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';

import { ROUTES, NUMBERS, COLORS } from "../../commons/constants";
import { getPropertyFromURI, getsetRepositoryLocalStorage, getsetTypeClassLocalStorage, setTypeClassLocalStorage } from "../../commons/utils";
import { api } from "../../services/api";
import { MHeader } from "../../components/MHeader";
import { LoadingContext, ClassRDFContext } from "../../App";
import { ClassModel } from "../../models/ClassModel";
import stylesGlobal from '../../styles/global.module.css';
import style from './navigation.module.css'


const GENERALIZATION = "0"
export function Classes() {
	const location = useLocation();
	const navigate = useNavigate();
	const { isLoading, setIsLoading } = useContext(LoadingContext);
	const { contextClassRDF, setContextClassRDF } = useContext(ClassRDFContext);
	const [classes, setClasses] = useState<ClassModel[]>([]);
	const [copyAllclasses, setCopyAllClasses] = useState<ClassModel[]>([]);
	const [foundClasses, setFoundClasses] = useState<ClassModel[]>([]);
	const [typeOfClass, setTypeOfClass] = useState<String>(GENERALIZATION);
	const [nameOfClassToFind, setNameOfClassToFind] = useState('');


	async function loadClasses() {
		let response: any
		try {
			setIsLoading(true)
			response = await api.get(`/classes/?type=${typeOfClass}&repo=${getsetRepositoryLocalStorage()}`);
		} catch (error) {
			console.log(`><`, error);
		} finally {
			window.scrollTo(0, NUMBERS.SCROOL_WINDOWS_Y)
			setTimeout(() => {
				setIsLoading(false)
				setClasses(response.data)
				setCopyAllClasses(response.data)
			}, NUMBERS.TIME_OUT_FROM_REQUEST)
		}

	}


	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTypeOfClass((event.target as HTMLInputElement).value);
		setTypeClassLocalStorage((event.target as HTMLInputElement).value)
	};

	useEffect(() => {
		loadClasses()
	}, [typeOfClass])

	useEffect(() => {
		console.log('**** CLASSE', getsetTypeClassLocalStorage())
		setTypeOfClass(getsetTypeClassLocalStorage())
	}, [])

	// const [selectedIndex, setSelectedIndex] = useState<Number>(1);
	const handleListOfClassesClick = (event: any, classRDF: ClassModel) => {
		// setContextClassRDF(classRDF.classURI.value)
		setContextClassRDF(classRDF)
		navigate(ROUTES.RESOURCES, { state: classRDF })
	};

	const handleSearchClassName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNameOfClassToFind((event.target as HTMLInputElement).value);
	};
	const handleSearchEscape = (event: KeyboardEvent) => {
		if (event.key == 'Escape') {
			setNameOfClassToFind('')
		}
	};

	useEffect(() => {
		function matchClasses() {
			if (nameOfClassToFind.length % 2 == 0) {
				let name_lower_case = nameOfClassToFind.toLowerCase()
				let _foundClasses = classes.filter((_class) => {
					let class_lower_case = _class?.label?.value.toLowerCase()
					return class_lower_case?.includes(name_lower_case) == true ? _class : null
				})
				// console.log(_foundClasses)
				_foundClasses.length > 0 ? setClasses(_foundClasses) : setClasses(copyAllclasses)
				setFoundClasses(_foundClasses)
			}
			if (nameOfClassToFind.length == 0) {
				setClasses(copyAllclasses)
			}
		}
		matchClasses()
	}, [nameOfClassToFind])


	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		minHeight: 300
	}));


	return (
		<div className={stylesGlobal.container}>
			<MHeader title={`Seleção de Classe`} />

			<Grid container spacing={0} sx={{ p: '4px 0' }}>
				{/* RADIO BUTTON */}
				<Grid item xs={6} sx={{ bgcolor: null }}>
					<FormControl>
						<RadioGroup
							row
							aria-labelledby="demo-controlled-radio-buttons-group"
							name="controlled-radio-buttons-group"
							value={typeOfClass}
							onChange={handleChange}
						>
							<FormControlLabel value="0" control={<Radio size="small" />} label="Generalização" sx={{
								'.css-ahj2mt-MuiTypography-root': {
									fontSize: '0.9rem !important',
								},
							}} />
							<FormControlLabel value="1" control={<Radio size="small" />} label="Visão Semântica Exportada" sx={{
								'.css-ahj2mt-MuiTypography-root': {
									fontSize: '0.9rem !important',
								},
							}} />
							<FormControlLabel value="2" control={<Radio size="small" />} label="KG Metadados" sx={{
								'.css-ahj2mt-MuiTypography-root': {
									fontSize: '0.9rem !important',
								},
							}} />
						</RadioGroup>
					</FormControl>
				</Grid>
				{/* PESQUISAR */}
				<Grid item xs={6} sx={{ bgcolor: null }} display={'flex'} justifyContent={'flex-end'}>
					<TextField sx={{ width: document.body.clientWidth * 0.3 }}
						id="outlined-basic" label="Pesquisar pelo nome da classe" variant="outlined" size="small"
						value={nameOfClassToFind}
						onChange={handleSearchClassName}
						error={nameOfClassToFind.length > 1 && foundClasses.length == 0}
						helperText={(nameOfClassToFind.length > 1 && foundClasses.length == 0) ? "Sem corespondência." : null}
						onKeyUp={handleSearchEscape}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
				{
					!isLoading && <Grid item xs={12} sx={{ marginBottom: '-10px !important' }}>
						<div style={{ background: COLORS.CINZA_01, paddingLeft: '10px' }}>
							<h4>{`Classes ${typeOfClass == "0" ? "de Generalização" : typeOfClass == "1" ? 'Exportadas' : 'Metadados'}`}</h4>
						</div>
					</Grid>
				}
				{
					!isLoading && classes.length > 0 && classes.map((classRDF, index) =>
						<Grid item xs={12} sm={6} md={3} key={index}>
							<Paper elevation={3} sx={{ minHeight: 300, justifyContent: "space-between" }} >
								<Stack
									direction="column"
									justifyContent="space-between"
									alignItems="center"
									spacing={2}
									sx={{ minHeight: 300 }}
								>
									<Box display='flex' flexDirection="column" p={1}>
										<Button variant="text" onClick={(event) => handleListOfClassesClick(event, classRDF)}>
											<Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
												{getPropertyFromURI(classRDF?.label?.value)}
											</Typography>
										</Button>
										<Typography variant="caption" component="div" color="ActiveCaption" align="center">
											{classRDF?.comment?.value}
										</Typography>
									</Box>
									<Box p={1} width={200} height={120} display="flex" alignItems="flex-end" justifyContent="flex-end">
										{classRDF?.image?.value && <img src={classRDF?.image?.value} alt={getPropertyFromURI(classRDF?.label?.value)} className={style.img_responsive}></img>}
									</Box>
								</Stack>
							</Paper>
						</Grid>
					)}
			</Grid>
		</div >
	);
}