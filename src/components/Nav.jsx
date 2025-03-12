import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  TeamOutlined,
  CarOutlined,
  UserOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import allRoutes from "../routes/AllRoutes";
const { Header, Sider, Content } = Layout;

const NavComponent = (children) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout style={{ margin: "0px" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={({ key }) => navigate(key)}
          items={[
            {
              key: allRoutes.home,
              icon: <HomeOutlined />,
              label: "Home",
            },
            {
              key: allRoutes.partenaire.base,
              icon: <TeamOutlined />,
              label: "Partenaire",
              children: [
                {
                  key: allRoutes.partenaire.morale.base,
                  label: "Morale",
                },
                {
                  key: allRoutes.partenaire.physique.base,
                  label: "Physique",
                },
                {
                  key: allRoutes.partenaire.typePartenaire.base,
                  label: "Type Partenaire",
                },
                {
                  key: allRoutes.partenaire.chauffeur,
                  label: "Chauffeur",
                },
              ],
            },
            {
              key: allRoutes.camion.base,
              icon: <CarOutlined />,
              label: "Camion",
              children: [
                {
                  key: allRoutes.camion.cabine,
                  label: "Cabine",
                },
                {
                  key: allRoutes.camion.remorque,
                  label: "Remorque",
                },
                {
                  key: allRoutes.document.base,
                  icon: <FileOutlined />,
                  label: "Documents",
                  children: [
                    {
                      key: allRoutes.document.assurance,
                      label: "Assurance",
                    },
                    {
                      key: allRoutes.document.entretient,
                      label: "Entretient",
                    },
                    {
                      key: allRoutes.document.carburant,
                      label: "Carburant",
                    },
                  ],
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default NavComponent;
