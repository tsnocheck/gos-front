import React from "react";
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Space,
  Button,
  type MenuProps,
} from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  BookOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { UserRole } from "../types/user.ts";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout, checkPermission } = useAuth();

  const hideItemByPermission = (roles: UserRole[]) =>
    !checkPermission(roles) ? { style: { display: "none" } } : {};

  const getMenuItems = (): MenuProps["items"] => {
    return [
      {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard">Главная</Link>,
      },
      {
        key: "/programs",
        icon: <BookOutlined />,
        label: "Программы",
        children: [
          {
            key: "/programs/list",
            label: <Link to="/programs">Список программ</Link>,
          },
          {
            key: "/programs/constructor",
            label: <Link to="/programs/constructor">Создать программу</Link>,
          },
        ],
        ...hideItemByPermission([UserRole.AUTHOR]),
      },
      {
        key: "/expertise",
        icon: <CheckCircleOutlined />,
        label: <Link to="/expertise">Экспертиза</Link>,
        ...hideItemByPermission([UserRole.EXPERT]),
      },
      {
        key: "/admin",
        icon: <TeamOutlined />,
        label: "Администрирование",
        children: [
          {
            key: "/admin/candidates",
            label: <Link to="/admin/candidates">Кандидаты</Link>,
            icon: <MonitorOutlined />,
          },
          {
            key: "/admin/users",
            label: <Link to="/admin/users">Пользователи</Link>,
            icon: <UserOutlined />,
          },
          {
            key: "/admin/users/archive",
            label: <Link to="/admin/users/archive">Архив пользователей</Link>,
            icon: <DeleteOutlined />,
          },
          {
            key: "/admin/programs",
            label: <Link to="/admin/programs">ДПП ПК</Link>,
            icon: <InboxOutlined />,
          },
          {
            key: "/admin/replace-expert",
            label: <Link to="/admin/replace-expert">Сменить эксперта</Link>,
            icon: <EditOutlined />,
          },
          {
            key: "/admin/dictionaries",
            label: <Link to="/admin/dictionaries">Справочники</Link>,
            icon: <BookOutlined />,
          },
        ],
        ...hideItemByPermission([UserRole.ADMIN]),
      },
      {
        key: "/profile",
        icon: <SettingOutlined />,
        label: <Link to="/profile">Профиль</Link>,
      },
    ];
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith("/programs")) return ["/programs"];
    if (path.startsWith("/expertise")) return ["/expertise"];
    if (path.startsWith("/admin")) return ["/admin"];
    if (path.startsWith("/profile")) return ["/profile"];
    return ["/dashboard"];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} theme="light">
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Портал
          </Title>
        </div>

        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={getMenuItems()}
          style={{ height: "calc(100% - 64px)", borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Space style={{ gap: 20 }}>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <span>
              {user?.firstName} {user?.lastName}
            </span>
            <Button type="primary" onClick={() => logout()}>
              Выход
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
