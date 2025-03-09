import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import "../styles/layout.css";

export default function Layout() {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {renderPage()}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Layout(props) {
  const { window } = props;
  const router = useDemoRouter(""); // hna 7ydt /home kant katdina par defaut l home mor makanbrko 3la partenaire
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => ({
        ...item,
        onClick: () => handleNavigation(item.pattern), // Add onClick handler
      }))}
      branding={{
        logo: <img src="src/assets/0.png" alt="MUI logo" />,
        title: "IZORAI",
        color: "primary",
        homeUrl: "/toolpad/core/introduction",
        sidebarExpandedWidth: "250px",
      }}
      router={router}
      theme={theme}
      window={demoWindow}
    >
      <DashboardLayout sidebarExpandedWidth="250px">
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
