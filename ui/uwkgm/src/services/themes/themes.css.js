import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { createMuiTheme } from "@material-ui/core/styles";

const colorMap = {blue: blue, green: green, grey: grey, orange: orange, red: red, yellow: yellow};
const darkWeight = 500;
const lightWeight = 800;

function generateColors(weight) {
    var colors = {}

    for (let [key, color] of Object.entries(colorMap)) {
        colors[key] = color[weight];
    }

    return colors;
}

export const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        background: {
            appBar: '#3A3A3A'
        },
        text: {
            normal: '#FFF'
        },
        select: {
            background: '#555',
            hover: {
                background: '#777'
            }
        },
        colors: generateColors(darkWeight)
    }
});

export const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        background: {
            appBar: '#F8F8F8'
        },
        text: {
            normal: '#000'
        },
        select: {
            background: '#F0F0F0',
            hover: {
                background: '#DDD'
            }
        },
        colors: generateColors(lightWeight)
    }
});
