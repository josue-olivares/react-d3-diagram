import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import HeaderNavbar from './components/navbar/navbar';
import SimpleCard from './components/base/simpleCard/simpleCard';
import PolarChart from './visualizations/d3/polarChart/polarChart';
import './App.scss';
import ArcsChart from './visualizations/d3/arcsChart/arcsChart';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 200,
  },
}));

let data = {
  origin: {  // === ORIGIN DIAMOND === //
      name: 'Origin', // name displayed below diamond
      message: 'origin tooltip example message', // used for tooltip
      status: 'none' // used for coloring the diamond 
  },
  loops: [  // === LOOPS / ARCS === //
      {
          name: 'Anchor 1', // name displayed below square
          inbound: [ // left side arc
              {
                  name: 'ABCD-1234', // identifies the circle
                  distanceFraction: 0.8, // fraction along the arc (0-1)
                  status: '#2AC892', // used for coloring the circles on the arcs
                  size: 25, // size of the circle
                  filled: false, // circle is filled if true, donut shape if false
                  message: 'circle tooltip example message 1' // used for tooltip
              }, {
                  name: 'ETOX-5346', 
                  distanceFraction: 0.6, 
                  status: '#ffffff',
                  size: 12,
                  filled: false,
                  message: 'circle tooltip example message 2' 
              }
          ],
          outbound: [],
          message: 'anchor example tooltip message', // used for tooltip
          status: 'none' // used for coloring the anchor squares
      }, 
      {
          name: 'Anchor 2', 
          inbound: [ 
              {
                  name: 'EEEE-4444', 
                  distanceFraction: 0.5, 
                  status: '#2AC892', 
                  size: 25, 
                  filled: false, 
                  message: 'circle tooltip example message 6' 
              }
          ],
          outbound: [ 
              {
                  name: 'CCCC-0000', 
                  distanceFraction: 0.84, 
                  status: '#ffffff',
                  size: 12,
                  filled: true,
                  message: 'circle tooltip example message 9' 
              },
              {
                  name: 'EEEE-27632', 
                  distanceFraction: 0.9, 
                  status: '#2AC892',
                  size: 25,
                  filled: true,
                  message: 'circle tooltip example message 10' 
              },
              {
                name: 'EEEE-27631', 
                distanceFraction: 0.99, 
                status: '#F3A52D',
                size: 25,
                filled: true,
                message: 'circle tooltip example message 10' 
            }
          ],
          message: 'anchor example tooltip message', 
          status: 'none'
      },
      {
          name: 'Anchor 3', 
          inbound: [ 
              {
                  name: 'EEEE-4444', 
                  distanceFraction: 0.694, 
                  status: '#F3A52D', 
                  size: 16, 
                  filled: false, 
                  message: 'circle tooltip example message 6' 
              }, {
                  name: 'BBBB-8432', 
                  distanceFraction: 0.234, 
                  status: '#ffffff',
                  size: 20,
                  filled: false,
                  message: 'circle tooltip example message 7' 
              }
          ],
          outbound: [ 
              {
                  name: 'CCCC-0000', 
                  distanceFraction: 0.9, 
                  status: '#FE5F53',
                  size: 14,
                  filled: true,
                  message: 'circle tooltip example message 9' 
              },                 {
                  name: 'EEEE-27632', 
                  distanceFraction: 0.99, 
                  status: '#ffffff',
                  size: 14,
                  filled: true,
                  message: 'circle tooltip example message 10' 
              }
          ],
          message: 'anchor example tooltip message', 
          status: 'none'
      },
  ]
}

let rowHeight = 325;


function App() {
  const classes = useStyles();
  return (
    <>

    <HeaderNavbar />

    <main className={classes.content}>
        <div className={classes.appBarSpacer}></div>
        <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={0} >
          <Grid item xs={12} sm={12} md={6} lg={4}>
              <SimpleCard title='Testing Arcs Charts' height={400}>
                <ArcsChart
                  data={data}
                  id={'A'} 
                />
              </SimpleCard>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <SimpleCard title='Testing Polar Charts' height={400}>
                <PolarChart 
                  data={[
                    {'angularCoord': -20, 'radialCoord': 0.9, 'size': 12, 'name': 'Label 1', 'status': 'On Time', 'fill': '#F3AE18' , 'stroke': 'none'},
                    {'angularCoord': 20, 'radialCoord': 0.6, 'size': 7, 'name': 'Label 2', 'status': 'On Time', 'fill': 'none' , 'stroke': '#3FCE9A'},
                    {'angularCoord': -39, 'radialCoord': 0.5, 'size': 7, 'name': 'Label 3', 'status': 'Delayed', 'fill': '#3FCE9A' , 'stroke': 'none'},
                    {'angularCoord': -120, 'radialCoord': 0.9, 'size': 7, 'name': 'Label 4', 'status': 'Delayed', 'fill': '#3FCE9A' , 'stroke': 'none'},
                    {'angularCoord': -160, 'radialCoord': 0.5, 'size': 12, 'name': 'Label 5', 'status': 'On Time', 'fill': '#3FCE9A' , 'stroke': 'none'},
                    {'angularCoord': -220, 'radialCoord': 0.75, 'size': 7, 'name': 'Label 6', 'status': 'On Time', 'fill': 'none' , 'stroke': '#F3AE18'},
                  ]} 
                  areaLabels={[
                    {'name': 'Area 1', 'radius': 0.23},
                    {'name': 'Area 2', 'radius': 0.52},
                    {'name': 'Area 3', 'radius': 0.78}
                  ]}
                  id={'F'} 
                />
              </SimpleCard>
          </Grid>
        </Grid>
      </Container>
    </main>
    </>
  );
}

export default App;
