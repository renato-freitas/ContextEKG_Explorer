import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'
import { ClassModel } from "../../models/ClassModel";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { getPropertyFromURI } from "../../commons/utils";
import { ROUTES, HIGHLIGHT_CLASSES, NUMBERS } from "../../commons/constants";
import { api } from "../../services/api";
import { MHeader } from "../../components/MHeader";
import { LoadingContext } from "../../App";
import styles from './navigation.module.css';

const GENERALIZATION = "0", EXPORTED = "1"

export function Classes() {
	const navigate = useNavigate();
	const { isLoading, setIsLoading } = useContext(LoadingContext);
	const [classes, setClasses] = useState<ClassModel[]>([]);
	const [classesDestaque, setClassesDestaque] = useState<ClassModel[]>([]);
	const [agroupedClasses, setLeis] = useState<any>({});
	const [agroupedClassesDestaque, setAgroupeeClassesDestaque] = useState<any>({});
	const [typeOfClass, setTypeOfClass] = useState<String>(GENERALIZATION);

	const [value, setValue] = useState('female');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTypeOfClass((event.target as HTMLInputElement).value);
	};

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
			}, NUMBERS.TIME_OUT_FROM_REQUEST)
		}

	}

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

	useEffect(() => {
		loadClasses()
	}, [typeOfClass])

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

			<FormControl>
				{/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
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

			{/* CLASSES DESTAQUE */}
			{!isLoading && <Box sx={{ flexGrow: 1, padding: 1 }}>
				<div style={{ background: "#ddd", padding: "0px 10px 0px 10px" }}>
					<h4>{`Classes ${typeOfClass == "0" ? "de Generalização" : 'Exportadas'}`}</h4>
				</div>



				<Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
					{
						!isLoading && classes && classes.map((classRDF, index) =>
							<Grid xs={12} sm={6} md={3} key={index}>
								<Item>
									<Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: classRDF }) }}>
										<Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
											{/* {resource.label?.value} */}
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
				{/* <Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {
            Object.keys(agroupedClassesDestaque).map((row, index) =>
              <Grid xs={12} sm={6} md={3} key={index}>
                <Item>
                  <Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: row }) }}>
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
                        <Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: agroupedClasses[row][ele]?.subclass?.value }) }}>
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
        </Grid> */}
			</Box>
			}

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
		</div >
	);
}



