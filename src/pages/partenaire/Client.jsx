import React from "react";

import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import SimpleForm from "../../components/form/SimpleForm";
import ClientForm from "../../components/form/ClientForm";

export default function Client() {
  const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
  }));
  return (
    <div>
      <Container>
        <h2>Gestion des de Client</h2>
        <Stack spacing={3}>
          <ClientForm />
        </Stack>
      </Container>
    </div>
  );
}
