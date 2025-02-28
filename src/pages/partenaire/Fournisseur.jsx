import React from 'react'


import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import SimpleForm from "../../components/form/SimpleForm";
import FournisseurForm from "../../components/form/FournisseurForm";

export default function Fournisseur() {
  
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
            <h2>Gestion des   Fournisseurs</h2>
            <Stack spacing={3}>
              <FournisseurForm />
            </Stack>
        </Container>
      </div>
    )
}
