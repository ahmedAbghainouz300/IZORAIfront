

import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import Breadcrumb from "../Breadcrumb";
import SimpleForm from "./SimpleForm";
// import StepperForm from "./StepperForm";
import FormulaireChaufeur from "./ChauffeurForm";
import Chauffeur from '../../pages/partenaire/Chauffeur';
import AppTable from "../tables/AppTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function ChauffeurContainer() {
  return (
    <Container>
    <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "Form" }]} />
      </Box> 
      <h2>Gestion des  de Chauffeur</h2>


      <Stack spacing={3}>
      <FormulaireChaufeur />
      <AppTable />  

        {/* <SimpleCard title="Simple Form">
          <SimpleForm />
        </SimpleCard>

        <SimpleCard title="stepper form">
          <StepperForm />
        </SimpleCard> */}
      </Stack>
    </Container>
  );
}