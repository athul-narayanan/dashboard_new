import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { extendTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import React, { useEffect, useState } from 'react';
import { getDashBoard } from '../services/dashboard';
import DashBoardItem from "./DashBoardItem";
import Recommendation from './Recommendation';

let NAVIGATION = [
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const [navigation, setNavigation] = React.useState(NAVIGATION)
  const router = useDemoRouter('/dashboard');
  const [dashboards, setDashBoards] = useState([])

  useEffect(() => {
    getDashBoardList()
  }, [])

  const getDashBoardList = async () => {
    try {
      const result = await getDashBoard()
      setDashBoards(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {

    const dashboard = {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
      children: [
      ],
    }
    dashboards.forEach((item) => {
      dashboard.children.push({
        segment: item.type,
        title: item.title,
        dashboards: item.dashboards,
        icon: <DescriptionIcon />
      })
    })

    const recommendationNav = {
      segment: 'recommendation',
      title: 'E-Com Recommendation',
      icon: <PrecisionManufacturingIcon />
    };

    NAVIGATION = [dashboard, recommendationNav]
    console.log(NAVIGATION)
    setNavigation(NAVIGATION)

  }, [dashboards])

  const renderContent = () => {
    switch (router.pathname) {
      case '/recommendation':
        return <Recommendation />;
  
      default:
        return <DashBoardItem path={router.pathname} navigation={navigation} />;
    }
  };
  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout style={{ width: "100%" }}>
        <PageContainer style={{ maxWidth: "100%", minHeight: "100%" }}>
          {renderContent()}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}