import React from 'react';
import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import FormulaireChaufeur from "../../components/form/ChauffeurForm";
import AppTable from "../../components/tables/AppTable";



export default function Chauffeur() {
  const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    }
  }));
  return (
    <div>
      
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "Form" }]} />
        </Box> 
        <h2>Gestion des  de Chauffeur</h2>

        <Stack spacing={3}>
          <FormulaireChaufeur />
        < AppTable />  
        </Stack>
    </Container>
    </div>
    
  );
}