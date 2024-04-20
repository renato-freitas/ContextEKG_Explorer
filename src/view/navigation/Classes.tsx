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

import { ROUTES, NUMBERS } from "../../commons/constants";
import { getPropertyFromURI } from "../../commons/utils";
import { api } from "../../services/api";
import { MHeader } from "../../components/MHeader";
import { LoadingContext } from "../../App";
import { ClassModel } from "../../models/ClassModel";
import { styled } from '@mui/material/styles';
import styles from './navigation.module.css';

const GENERALIZATION = "0"
export function Classes() {
	const navigate = useNavigate();
	const { isLoading, setIsLoading } = useContext(LoadingContext);
	const [classes, setClasses] = useState<ClassModel[]>([]);
	const [copyAllclasses, setCopyAllClasses] = useState<ClassModel[]>([]);
	const [foundClasses, setFoundClasses] = useState<ClassModel[]>([]);
	const [typeOfClass, setTypeOfClass] = useState<String>(GENERALIZATION);
	const [name, setName] = useState('');



	async function loadClasses() {
		let response: any
		try {
			setIsLoading(true)
			response = await api.get(`/classes/?type=${typeOfClass}`);
			console.log(response.data)
		} catch (error) {
			console.log(`><`, error);
		} finally {
			window.scrollTo(0, 0)
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



	const handleSearchClassName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName((event.target as HTMLInputElement).value);
		console.log(event.target.onkeyup)
	};
	const handleSearchEscape = (event: KeyboardEvent) => {
		if(event.key == 'Escape'){
			setName('')
		}
	};

	useEffect(() => {
		function matchClasses() {
			if (name.length % 2 == 0) {
				// setIsLoading(true)
				let name_lower_case = name.toLowerCase()
				let _foundClasses = classes.filter((_class) => {
					let class_lower_case = _class?.label?.value.toLowerCase()
					return class_lower_case?.includes(name_lower_case) == true ? _class : null
				})
				console.log(_foundClasses)
				_foundClasses.length > 0 ? setClasses(_foundClasses) : setClasses(copyAllclasses)
				setFoundClasses(_foundClasses)
				// setIsLoading(false)
			}
			if (name.length == 0) {
				setClasses(copyAllclasses)
			}
		}
		matchClasses()
	}, [name])


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

			<Grid container spacing={1} sx={{ p: '2px 0' }}>
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
							<FormControlLabel value="0" control={<Radio />} label="Generalização" />
							<FormControlLabel value="1" control={<Radio />} label="Visão Semântica Exportada" />
						</RadioGroup>
					</FormControl>
				</Grid>
				{/* PESQUISAR */}
				<Grid item xs={6} display='flex' justifyContent='flex-end' sx={{ bgcolor: null }}>
					<TextField sx={{ width: 500 }}
						id="outlined-basic" label="Pesquisar pelo nome da classe" variant="outlined" size="small"
						value={name}
						onChange={handleSearchClassName}
						error={name.length > 1 && foundClasses.length == 0}
						helperText={(name.length > 1 && foundClasses.length == 0) ? "Sem corespondência." : null}
						onKeyUp={handleSearchEscape}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
				{
					!isLoading && <Grid item xs={12} sx={{ marginBottom: '-10px !important' }}>
						<div style={{ background: "#ddd" }}>
							<h4>{`Classes ${typeOfClass == "0" ? "de Generalização" : 'Exportadas'}`}</h4>
						</div>
					</Grid>
				}
				{
					!isLoading && classes && classes.map((classRDF, index) =>
						<Grid item xs={12} sm={6} md={3} key={index}>
							<Item>
								<Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: classRDF }) }}>
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


{/* <Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
						{
							!isLoading && classes && classes.map((classRDF, index) =>
								<Grid xs={12} sm={6} md={3} key={index}>
									<Item>
										<Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: classRDF }) }}>
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
					</Grid> */}












{/* <Box sx={{ flexGrow: 1, padding: 1 }}>
        <div style={{ background: "#ddd", padding: "0px 10px 0px 10px" }}>
          <h4>Classes</h4>
        </div>
        <Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {
            Object.keys(agroupedClasses).map((row, index) =>
              <Grid xs={12} sm={6} md={3} key={index}>
                <Item>
                  <Button onClick={() => { navigate(ROUTES.RESOURCES, { state: row }) }}>
                    <Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
                      {getPropertyFromURI(agroupedClasses[row][0]?.label.value)}
                    </Typography>
                  </Button>
                  <Typography variant="caption" component="div" color="gray" sx={{ wordBreak: "break-word" }}>
                    {agroupedClasses[row][0]?.class.value}
                  </Typography>
                  <Typography variant="caption" component="div" color="ActiveCaption">
                    {agroupedClasses[row][0]?.comment.value}
                  </Typography>

                  <Box sx={{ textAlign: "left", mt: 3 }}>
                    {
                      agroupedClasses[row][0]?.subclass && <Typography variant="caption" component="div" color="brown" sx={{ fontSize: "1rem" }}>
                        SubClasses
                      </Typography>
                    }
                    {
                      agroupedClasses[row][0]?.subclass && [...Array(agroupedClasses[row].length).keys()].map((ele, i) =>
                        <Button size="small" onClick={() => { navigate(ROUTES.RESOURCES, { state: row }) }}>
                          <Typography key={i} variant="h6" component="div" sx={{ fontSize: "0.7rem", fontWeight: '500' }}>
                            {getPropertyFromURI(agroupedClasses[row][ele]?.subclass?.value)}
                          </Typography>
                        </Button>
                      )
                    }
                  </Box>
                </Item>
              </Grid>
            )}
        </Grid>
      </Box> */}




// async function loadDomainOntologyClasses() {
//   try {
//     const response = await api.get("/classes");
//     response.data.forEach((ele: ClassModel) => {
//       if (!agroupedClasses[ele.class.value]) {
//         agroupedClasses[ele.class.value] = [ele]
//       }
//       else {
//         agroupedClasses[ele.class.value].push(ele)
//       }
//       if (HIGHLIGHT_CLASSES.includes(ele.class.value)) {
//         if (!agroupedClassesDestaque[ele.class.value]) {
//           agroupedClassesDestaque[ele.class.value] = [ele]
//         }
//         else {
//           agroupedClassesDestaque[ele.class.value].push(ele)
//         }
//         setClassesDestaque([...classesDestaque, ele])
//       }
//     });

//     setClasses(response.data)
//   } catch (error) {
//     console.log(`><`, error);
//   } finally {
//   }
// }