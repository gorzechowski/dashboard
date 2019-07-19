import * as React from 'react';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';

const Theme = createMuiTheme({
    palette: {
        primary: {
            light: grey[700],
            main: grey[800],
            dark: grey[900],
        },
        secondary: {
            light: blue[600],
            main: blue[700],
            dark: blue[800],
        },
        text: {
            primary: '#fff',
            secondary: '#000',
        },
    },
});

export class ThemeProvider extends React.PureComponent<any, any> {
    public render() {
        return (
            <MuiThemeProvider theme={Theme}>
                <StyledComponentsThemeProvider theme={Theme}>
                    <>
                        {this.props.children}
                    </>
                </StyledComponentsThemeProvider>
            </MuiThemeProvider>
        );
    }
}
