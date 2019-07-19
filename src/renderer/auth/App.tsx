import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import { Authenticate } from '../../ipc/command';
import { IpcInterface } from '../../ipc/Renderer';
import { ThemeProvider } from './containers';
import { Typography } from '@material-ui/core';

interface AppProps {
    ipc: IpcInterface;
}

interface AppState {
    username: string;
    password: string;
    host: string;
}

const Container = styled(Grid)`
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.background.default};
`;

const Form = styled.form`
    width: 20%;
`;

const GridItem = styled(Grid)`
    && {
        margin: ${({ theme }) => theme.spacing(1)}px;
    }
`;

const StyledTextField = styled(TextField)`
    && {
        input {
            color: ${({ theme }) => theme.palette.text.secondary};
        }
    }
`;

export default class App extends React.Component<AppProps, AppState> {
    public state = {
        username: '',
        password: '',
        host: null,
    };

    public componentWillMount() {
        const host = window.location.hash.replace('#', '');

        this.setState({ host });
    }

    public render() {
        const { username, password, host } = this.state;

        return (
            <ThemeProvider>
                <Container container>
                    <Grid item>
                        <Typography variant='h5'>Host <b>{host}</b> requested authentication</Typography>
                    </Grid>
                    <Form onSubmit={this.onSubmitted}>
                        <GridItem item>
                            <StyledTextField
                                id='username'
                                label='Username'
                                variant='filled'
                                fullWidth
                                required
                                value={username}
                                onChange={event => {
                                    this.setState({ username: event.target.value });
                                }}
                            />
                        </GridItem>
                        <GridItem item>
                            <StyledTextField
                                id='password'
                                label='Password'
                                type='password'
                                variant='filled'
                                fullWidth
                                required
                                value={password}
                                onChange={event => {
                                    this.setState({ password: event.target.value });
                                }}
                            />
                        </GridItem>
                        <GridItem item>
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                            >
                                OK
                            </Button>
                        </GridItem>
                    </Form>
                </Container>
            </ThemeProvider>
        );
    }

    private onSubmitted = () => {
        const { ipc } = this.props;
        const { username, password, host } = this.state;

        ipc.command(Authenticate, {
            username,
            password,
            host,
        } as Authenticate);
    }
}
