import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './simpleCard.scss';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        margin: 16,
        backgroundColor: '#223444',
        font: 'Roboto'
    },
    title: {
        fontSize: '1.2em',
        color: '#FFF',
    }
});

const SimpleCard = (props) => {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} gutterBottom>
                    {props.title}
                </Typography>
                <Box height={props.height}>{props.children}</Box>
            </CardContent>
        </Card>
    );
}
export default SimpleCard;