// import React from "react";
// import { Box, Button, StepContent } from "@mui/material";
// import Container from "@mui/material/Container";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import * as zod from 'zod';

// import { MetadataGraphEntity } from "../../models/MetadataGraphEntity";

// export interface LocationParams {
//   pathname: string;
//   state: MetadataGraphEntity;
//   search: string;
//   hash: string;
//   key: string;
// }

// const LocalGraphSchema = zod.object({
//   identifier: zod.string().optional(),
//   title: zod.string().min(1, 'Digite ao menos 1 caracter'),
//   comment: zod.string().optional(),
//   created: zod.string().optional(),
//   prefix: zod.string().optional(),
//   modified: zod.string().optional(),
//   belongsTo: zod.string().optional(),
// });

// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import Typography from '@mui/material/Typography';

// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];
// const steps = ['Rótulo', 'Tabela', 'Classe', 'Propriedades'];

export function TriplesmapForm() {
  // const [activeStep, setActiveStep] = React.useState(0);
  // const [skipped, setSkipped] = React.useState(new Set<number>());

  // const isStepOptional = (step: number) => {
  //   return step === 3;
  // };

  // const isStepSkipped = (step: number) => {
  //   return skipped.has(step);
  // };

  // const handleNext = () => {
  //   let newSkipped = skipped;
  //   if (isStepSkipped(activeStep)) {
  //     newSkipped = new Set(newSkipped.values());
  //     newSkipped.delete(activeStep);
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped(newSkipped);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleSkip = () => {
    // if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      // throw new Error("You can't skip a step that isn't optional.");
    // }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };



  // function getStepContent(step: number) {
  //   switch (step) {
  //     case 0:
  //       return (
  //         <form className="form-group">
  //           <label>First Name</label>
  //           <input type="text" placeholder="First Name"></input>
  //           <br></br>
  //           <label>Last Name</label>
  //           <input type="text" placeholder="Last Name"></input>
  //         </form>
  //       );
  //     case 1:
  //       return (
  //         <form className="form-group">
  //           <label>High School Percentage</label>
  //           <input type="number" placeholder="High School Percentage"></input>
  //           <br></br>
  //           <label>Graduation percentage</label>
  //           <input type="number" placeholder="Graduation Percentage"></input>
  //         </form>
  //       );
  //     case 2:
  //       return (
  //         <form className="form-group">
  //           <label>Permanent Address</label>
  //           <input type="text" placeholder="Permanent Address"></input>
  //           <br></br>
  //           <label>Temporary Address</label>
  //           <input type="text" placeholder="Temporary Address"></input>
  //         </form>
  //       );
  //     default:
  //       return 'Unknown step';
  //   }
  // }


  // return (
  //   <Container fixed>
  //     <h1>{`${'Cadastrar'} Mapeamento R2RML`}</h1>
  //     <Card
  //       variant="outlined"
  //       sx={{ p: 0 }}
  //     >
  //       <CardContent sx={{ padding: '30px' }}>
  //         <Box sx={{ width: '100%' }}>
  //           <Stepper activeStep={activeStep}>
  //             {steps.map((label, index) => {
  //               const stepProps: { completed?: boolean } = {};
  //               const labelProps: {
  //                 optional?: React.ReactNode;
  //               } = {};
  //               if (isStepOptional(index)) {
  //                 labelProps.optional = (
  //                   <Typography variant="caption">Optional</Typography>
  //                 );
  //               }
  //               if (isStepSkipped(index)) {
  //                 stepProps.completed = false;
  //               }
  //               return (
  //                 <Step key={label} {...stepProps}>
  //                   <StepLabel {...labelProps}>{label}</StepLabel>
  //                   <StepContent>{getStepContent(index)}</StepContent>
  //                 </Step>
  //               );
  //             })}
  //           </Stepper>


  //           {activeStep === steps.length ? (
  //             <React.Fragment>
  //               <Typography sx={{ mt: 2, mb: 1 }}>
  //                 All steps completed - you&apos;re finished
  //               </Typography>
  //               <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
  //                 <Box sx={{ flex: '1 1 auto' }} />
  //                 <Button onClick={handleReset}>Reset</Button>
  //               </Box>
  //             </React.Fragment>
  //           ) : (
  //             <React.Fragment>
  //               <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
  //               <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
  //                 <Button
  //                   color="inherit"
  //                   disabled={activeStep === 0}
  //                   onClick={handleBack}
  //                   sx={{ mr: 1 }}
  //                 >
  //                   Back
  //                 </Button>
  //                 <Box sx={{ flex: '1 1 auto' }} />
  //                 {isStepOptional(activeStep) && (
  //                   <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
  //                     Skip
  //                   </Button>
  //                 )}
  //                 <Button onClick={handleNext}>
  //                   {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
  //                 </Button>
  //               </Box>
  //             </React.Fragment>
  //           )}
  //         </Box>
  //       </CardContent>
  //     </Card>
  //   </Container>
  // );
}
