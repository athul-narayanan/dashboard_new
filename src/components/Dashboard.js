import React, {useState} from 'react'
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import DashBoardItem from "./DashBoardItem"

// Need to be replaced with actual data
const data = [
  {
    type: "us-senate-election",
    title: "US Senate Election 1967-2022",
    dashboards: [
      {
        "name" : "Distribution by State and Year",
        "link" : "https://public.tableau.com/views/Book3_17425929926010/Sheet1?:language=en-GB&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
      },
      {
        "name" : "Total Votes",
        "link" : "https://public.tableau.com/shared/M5BF4XRNX?:display_count=n&:origin=viz_share_link"
      },
    ]
  },
  {
    type: "crime",
    title: "Crime Data",
    dashboards: [
      {
        "name" : "Crime By Region",
        "link" : "https://public.tableau.com/views/LearnEmbeddedAnalytics/SalesOverviewDashboard?:language=en-GB&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
      },
      {
        "name" : "Crime Rate By Year",
        "link" : "https://public.tableau.com/views/PublicSectorEmergencyCallsDashboardB2VBRWFD/Overview?:language=en-GB&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
      },
    ]
  }
]
const NAVIGATION = [
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

  React.useEffect(()=>{
    const dashboard= {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
      children: [
      ],
    }
    data.forEach((item)=>{
      dashboard.children.push({
        segment: item.type,
        title: item.title,
        dashboards: item.dashboards,
        icon: <DescriptionIcon />
      })
      
    })
    NAVIGATION.push(dashboard)
    console.log(NAVIGATION)
    setNavigation(NAVIGATION)
  },[])

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout style={{width: "100%"}}>
        <PageContainer style={{maxWidth:"100%", minHeight:"100%"}}>
          <DashBoardItem path={router.pathname} navigation={navigation}/>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}