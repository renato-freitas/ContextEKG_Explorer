import { useState, useEffect, useContext, KeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../redux/store'
import { updateView, updateExportedView, updateClassRDF } from '../../redux/globalContextSlice';

import { ROUTES, NUMBERS, COLORS } from "../../commons/constants";
import {
	getPropertyFromURI, getsetRepositoryLocalStorage,
	getTypeOfClassOnLocalStorage,
	setTypeClassLocalStorage as setTypeOfClassOnLocalStorage
} from "../../commons/utils";
import { api } from "../../services/api";
import { MHeader } from "../../components/MHeader";
import { LoadingContext, ClassRDFContext } from "../../App";
import { ClassModel } from "../../models/ClassModel";
import stylesGlobal from '../../styles/global.module.css';
import style from './navigation.module.css'

// https://medium.com/@lucas_pinheiro/como-adicionar-internacionaliza%C3%A7%C3%A3o-i18n-na-sua-aplica%C3%A7%C3%A3o-react-a1ac4aea109d
// const NUMBER_OF_GENERALIZATION_CLASS = "0"
export function Classes() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const global_context = useSelector((state: RootState) => state.globalContext)
	const { isLoading, setIsLoading } = useContext(LoadingContext);
	const [classes, setClasses] = useState<ClassModel[]>([]);
	const [exportedViews, setExportedViews] = useState<any[]>([]);
	const [selectedExportedView, setSelectedExportedView] = useState<string>("");
	const [copyAllclasses, setCopyAllClasses] = useState<ClassModel[]>([]);
	const [foundClasses, setFoundClasses] = useState<ClassModel[]>([]);
	// const [typeOfClass, setTypeOfClass] = useState<String>(getTypeOfClassOnLocalStorage());
	const [nameOfClassToFind, setNameOfClassToFind] = useState('');


	async function loadClasses() {
		let response: any
		try {
			setIsLoading(true)
			// response = await api.get(`/classes/?type=${globalContext.view}&exported_view=${selectedExportedView}&language=${selectedLanguage}`);
			response = await api.get(`/classes/?view=${global_context.view}&exported_view=${global_context.exportedView}&language=${global_context.language}`);
			// console.log('*** CLASSES ***', response.data)
			setClasses(response.data)
			setCopyAllClasses(response.data)
			setIsLoading(false)
		} catch (error) {
			console.error(`---catch---`, error);
		} finally {
			window.scrollTo(0, NUMBERS.SCROOL_WINDOWS_Y)
		}

	}



	async function loadExportedViews() {
		let response: any
		try {
			setIsLoading(true)
			response = await api.get('/classes/exported-views');
			setExportedViews(response.data)
			console.log('-----visões exportadas-----', response.data)
		} catch (error) {
			console.log(`><`, error);
		} finally {
			window.scrollTo(0, NUMBERS.SCROOL_WINDOWS_Y)
			setIsLoading(false)
		}

	}




	const handleChangeOfView = (event: React.ChangeEvent<HTMLInputElement>) => {
		if ((event.target as HTMLInputElement).value == NUMBERS.CODE_OF_UNIFICATION_VIEW
			|| (event.target as HTMLInputElement).value == NUMBERS.CODE_OF_FUSION_VIEW) {
			setExportedViews([])
		}
		// setTypeOfClass((event.target as HTMLInputElement).value);
		// setTypeOfClassOnLocalStorage((event.target as HTMLInputElement).value)

		/** REDUX TOOLKIT */
		dispatch(updateView((event.target as HTMLInputElement).value))
	};

	useEffect(() => {
		console.log('--- use effect type of class ---')
		console.log('--- global_context ---', global_context)

		// console.log('** REPOSITÓRIO NO API.HEADER **', api.defaults.headers.common['repo'])
		setClasses([])
		const _repo_in_api_header = api.defaults.headers.common['repo']
		if (_repo_in_api_header) {
			// if (typeOfClass == NUMBERS.CODE_OF_EXPORTED_VIEW && exportedViews.length == 0) {
			if (global_context.view == NUMBERS.CODE_OF_EXPORTED_VIEW && exportedViews.length == 0) {
				loadExportedViews()
				if (selectedExportedView != "") loadClasses()
			}
			else {
				loadClasses()
			}
		}
		else {
			api.defaults.headers.common['repo'] = getsetRepositoryLocalStorage()
			navigate(ROUTES.REPOSITORY_LIST)
		}
		// }, [typeOfClass, selectedExportedView])
	}, [global_context.view, selectedExportedView])


	// useEffect(() => {
	// 	console.log('-----buscar classes da visão exportada selecionada-----\n')
	// 	console.log('SEV', selectedExportedView)
	// 	console.log('state', location.state)
	// 	console.log('local', window.localStorage.getItem("classe"))
	// 	setClasses([])
	// 	const _repo_in_api_header = api.defaults.headers.common['repo']
	// 	if (_repo_in_api_header) {
	// 		if(classes.length <= 0) loadClasses()
	// 	}
	// 	else navigate(ROUTES.REPOSITORY_LIST)
	// }, [selectedExportedView])

	// useEffect(() => {
	// 	setClasses([])
	// 	console.log('*** CLASSE NO LOCAL STORAGE ***', window.localStorage.getItem(LOCAL_STORAGE.TYPE_OF_CLASS))
	// 	const _type_of_class_in_local_storage = window.localStorage.getItem(LOCAL_STORAGE.TYPE_OF_CLASS)
	// 	// if (_type_of_class_in_local_storage) setTypeOfClass(_type_of_class_in_local_storage)
	// 	// else setTypeOfClass(NUMBERS.GENERALIZATION_CLASS_NUMBER)
	// 	setTypeOfClass(NUMBERS.GENERALIZATION_CLASS_NUMBER)
	// }, [])



	// const [selectedIndex, setSelectedIndex] = useState<Number>(1);
	const handleListOfClassesClick = (event: any, classRDF: ClassModel) => {
		// setContextClassRDF(classRDF.classURI.value)
		// updateGlobalContext({classURI: classRDF.classURI.value})
		dispatch(updateClassRDF(classRDF))
		// setContextClassRDF(classRDF)
		// navigate(ROUTES.RESOURCES, { state: { classRDF, typeOfClass } })
		navigate(ROUTES.RESOURCES)
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


	const subTitle = () => {
		let _c_g = global_context.language == 'pt' ? "Classes de Generalização" : "Generalization Classes"
		let _c_e = global_context.language == 'pt' ? "Classes Exportadas" : "Exported Classes"
		let _c_m = global_context.language == 'pt' ? "Classes de Generalização" : "Generalization Classes"
		// return `${typeOfClass == "0" ? _c_g : typeOfClass == "1" ? _c_e : _c_m}`
		return `${global_context.view == "0" ? _c_g : global_context.view == "1" ? _c_e : _c_m}`
	}

	return (
		<div className={stylesGlobal.container}>
			{/* <div style={{paddingLeft:60}}> */}
			{/* <MHeader title={`${window.localStorage.getItem('LANGUAGE') == 'pt' ? 'Seleção de Classe' : 'Class Selection'}`} /> */}
			<MHeader title={`${global_context.language == 'pt' ? 'Seleção de Classe' : 'Context Selection'}`} />
			{/* </div> */}

			<Grid container spacing={0} sx={{ p: '4px 0' }}>
				{/* RADIO BUTTONS | SELEÇÃO DE NÍVEL DE VISÃO*/}
				<Grid item xs={6} sx={{ bgcolor: null }}>
					<FormControl>
						<RadioGroup
							row
							aria-labelledby="demo-controlled-radio-buttons-group"
							name="controlled-radio-buttons-group"
							// value={typeOfClass}
							value={global_context.view}
							onChange={handleChangeOfView}
						>
							<FormControlLabel value="0" control={<Radio size="small" />} label={`${global_context.language == 'pt' ? "Visão de Unificação" : 'Unification View'}`} sx={{
								'.css-ahj2mt-MuiTypography-root': {
									fontSize: '0.9rem !important',
								},
							}} />
							<FormControlLabel value="1" control={<Radio size="small" />} label={`${global_context.language == 'pt' ? "Visão Exportada" : 'Exported View'}`} sx={{
								'.css-ahj2mt-MuiTypography-root': {
									fontSize: '0.9rem !important',
								},
							}} />
							<FormControlLabel value="2" control={<Radio size="small" />} label={`${global_context.language == 'pt' ? "Visão de Fusão" : 'Fusion View'}`} sx={{
								'.css-ahj2mt-MuiTypography-root': {
									fontSize: '0.9rem !important',
								},
							}} />
						</RadioGroup>
					</FormControl>
				</Grid>
				{/* CAMPO DE PESQUISA */}
				<Grid item xs={6} sx={{ bgcolor: null }} display={'flex'} justifyContent={'flex-end'}>
					<TextField sx={{ width: document.body.clientWidth * 0.3 }}
						id="outlined-basic" label={global_context.language == 'pt' ? "Pesquisar pelo nome da classe" : "Search by name"} variant="outlined" size="small"
						value={nameOfClassToFind}
						onChange={handleSearchClassName}
						error={nameOfClassToFind.length > 1 && foundClasses.length == 0}
						helperText={(nameOfClassToFind.length > 1 && foundClasses.length == 0) ? "Sem corespondência." : null}
						onKeyUp={handleSearchEscape}
					/>
				</Grid>
			</Grid>

			{/* FONTES DE DADOS | EXPORTED VIEWS */}
			{
				exportedViews.length > 0
					? <>
						<Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }} marginBottom={1}>
							{
								exportedViews.map((e, i) => <Grid key={i} item xs={12} sm={6} md={3}>
									<Button
										sx={{ textTransform: 'none' }}
										size="small"
										disabled={selectedExportedView == e.datasource?.value}
										variant="contained"
										onClick={() => {
											setSelectedExportedView(e.datasource.value)
											dispatch(updateExportedView(e.datasource.value))
										}
										}
									>
										{e.datasource?.value}
									</Button>
								</Grid>)
							}
						</Grid>
						{
							!isLoading && classes.length > 0 && <Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								<Grid item xs={12} sx={{ marginBottom: '-10px !important' }}>
									{
										!isLoading &&
										<div style={{ background: COLORS.CINZA_01, paddingLeft: '10px' }}>
											<h5>{subTitle()}{` (${classes.length > 0 ? classes.length : ""})`}</h5>
										</div>
									}
								</Grid>
								{
									!isLoading && classes.map((classRDF, index) => <Grid item xs={12} sm={6} md={3} key={index}>
										<Paper elevation={3} sx={{ minHeight: 200, justifyContent: "space-between" }} >
											<Stack
												direction="column"
												justifyContent="space-between"
												alignItems="center"
												spacing={2}
												sx={{ minHeight: 200, maxHeight: 250 }}
											>
												<Box display='flex' flexDirection="column" p={1} width={220}>
													<Button size="small" onClick={(event) => handleListOfClassesClick(event, classRDF)}>
														<Typography variant="h6" component="div" sx={{ fontSize: ".8rem", fontWeight: '600' }}>
															{getPropertyFromURI(classRDF?.label?.value)}
														</Typography>
													</Button>
													{/* <Typography sx={{ fontSize: ".55rem", fontWeight: 400, textAlign: "center", whiteSpace: "pre-wrap" }} color="text.primary" gutterBottom>
													{classRDF?.classURI.value}
												</Typography> */}
													<Typography component="div" color="ActiveCaption" align="center" sx={{ fontSize: ".65rem" }}>
														{classRDF?.comment?.value}
													</Typography>
												</Box>
												<Box p={1} width={200} height={120} display="flex" alignItems="flex-end" justifyContent="flex-end">
													{classRDF?.image?.value && <img src={classRDF?.image?.value} alt={getPropertyFromURI(classRDF?.label?.value)} className={style.img_responsive}></img>}
												</Box>
											</Stack>
										</Paper>
									</Grid>)
								}
							</Grid>
						}
					</>
					:
					<Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
						<Grid item xs={12} sx={{ marginBottom: '-10px !important' }}>
							{
								!isLoading && <div style={{ background: COLORS.CINZA_01, paddingLeft: '10px' }}>
									<h4>{subTitle()}{` (${classes.length > 0 ? classes.length : ""})`}</h4>
								</div>
							}
						</Grid>
						{/* CLASSES DA ONTOLOGIA */}
						{
							!isLoading && classes.length > 0 && classes.map((classRDF, index) => <Grid item xs={12} sm={6} md={3} key={index}>
								<Paper elevation={3} sx={{ minHeight: 200, justifyContent: "space-between" }} >
									<Stack
										direction="column"
										justifyContent="space-between"
										alignItems="center"
										spacing={2}
										sx={{ minHeight: 200, maxHeight: 250 }}
									>
										<Box display='flex' flexDirection="column" p={1} width={220}>
											<Button size="small" onClick={(event) => handleListOfClassesClick(event, classRDF)}>
												<Typography variant="h6" component="div" sx={{ fontSize: ".8rem", fontWeight: '600' }}>
													{getPropertyFromURI(classRDF?.label?.value)}
												</Typography>
											</Button>
											{/* <Box width={220}>
												<Typography sx={{ fontSize: ".55rem", fontWeight: 400, textAlign: "center", whiteSpace: "pre-wrap" }} color="text.primary" gutterBottom>
													{classRDF?.classURI.value}
												</Typography>
											</Box> */}
											<Typography variant="caption" component="div" color="ActiveCaption" align="center">
												{classRDF?.comment?.value}
											</Typography>
										</Box>
										{/* <Box p={1} width={200} height={120} display="flex" alignItems="flex-end" justifyContent="flex-end"> */}
										<Box p={1} width={200} height={50} display="flex" alignItems="flex-end" justifyContent="flex-end">
											{classRDF?.image?.value && <img src={classRDF?.image?.value} alt={getPropertyFromURI(classRDF?.label?.value)} className={style.img_responsive}></img>}
										</Box>
									</Stack>
								</Paper>
							</Grid>)
						}
					</Grid>
			}
		</div >
	);
}