import { useState, useEffect, useContext, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { ROUTES, NUMBERS, COLORS } from "../../commons/constants";
import { getPropertyFromURI } from "../../commons/utils";
import { api } from "../../services/api";
import { MHeader } from "../../components/MHeader";
import { LoadingContext, ClassRDFContext } from "../../App";
import { ClassModel } from "../../models/ClassModel";
import { styled } from '@mui/material/styles';
import styles from './navigation.module.css';

const GENERALIZATION = "0"
export function Classes() {
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
			response = await api.get(`/classes/?type=${typeOfClass}`);
			console.log(response.data)
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
	};

	useEffect(() => {
		loadClasses()
	}, [typeOfClass])


	// const [selectedIndex, setSelectedIndex] = useState<Number>(1);
	const handleListOfClassesClick = (event: any, classRDF: ClassModel) => {
		// setContextClassRDF(classRDF.classURI.value)
		setContextClassRDF(classRDF)
		navigate(ROUTES.RESOURCES, { state: classRDF })
	};

	const handleSearchClassName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNameOfClassToFind((event.target as HTMLInputElement).value);
		console.log(event.target.onkeyup)
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
				console.log(_foundClasses)
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
		<div className={styles.listkg}>
			<MHeader title={`Seleção de Classe`} />

			<Grid container spacing={0} sx={{ p: '4px 0' }}>
				{/* RADIO BUTTON */}
				<Grid item xs={6} sx={{ bgcolor:null }}>
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
						</RadioGroup>
					</FormControl>
				</Grid>
				{/* PESQUISAR */}
				<Grid item xs={6} sx={{ bgcolor:null }} display={'flex'} justifyContent={'flex-end'}>
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
						<div style={{ background: COLORS.CINZA_01 }}>
							<h4>{`Classes ${typeOfClass == "0" ? "de Generalização" : 'Exportadas'}`}</h4>
						</div>
					</Grid>
				}
				{
					!isLoading && classes.length > 0 && classes.map((classRDF, index) =>
						<Grid item xs={12} sm={6} md={3} key={index}>
							<Item>
								{/* <Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: classRDF }) }}> */}
								<Button variant="text" onClick={(event) => handleListOfClassesClick(event, classRDF)}>
									<Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
										{getPropertyFromURI(classRDF?.label?.value)}
									</Typography>
								</Button>
								<Typography variant="caption" component="div" color="ActiveCaption">
									{classRDF?.comment?.value}
								</Typography>
							</Item>
						</Grid>
					)}
			</Grid>
		</div >
	);
}