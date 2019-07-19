import * as React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';

interface AppBarProps {
    onCloseClicked: () => void;
    onSaveClicked: () => void;
    saveEnabled: boolean;
    closeEnabled: boolean;
}

const Title = styled(Typography)`
    && {
        flex-grow: 1;
    }
`;

const CloseButton = styled(IconButton)`
    && {
        margin-right: ${({ theme }) => theme.spacing(1)}px;
    }
`;

const ButtonsContainer = styled.div`
    button {
        margin-left: ${({ theme }) => theme.spacing(1)}px;
    }
`;

export class AppBar extends React.PureComponent<AppBarProps, any> {
    public render() {
        const { onCloseClicked, onSaveClicked, saveEnabled, closeEnabled, children } = this.props;

        return (
            <MuiAppBar position='static'>
                <Toolbar>
                    <Tooltip title={closeEnabled ? 'Close' : 'At least one tab must be defined'}>
                        <span>
                            <CloseButton
                                edge='start'
                                color='inherit'
                                onClick={onCloseClicked}
                                disabled={!closeEnabled}
                            >
                                <CloseIcon />
                            </CloseButton>
                        </span>
                    </Tooltip>
                    <Title variant='h6'>
                        Settings
                    </Title>

                    <ButtonsContainer>
                        {children}
                        <Tooltip title={saveEnabled ? 'Save and restart' : 'At least one tab must be defined'}>
                            <span>
                                <Button
                                    color='secondary'
                                    variant='contained'
                                    onClick={onSaveClicked}
                                    disabled={!saveEnabled}
                                >
                                    <DoneIcon />
                                    Save and restart
                                </Button>
                            </span>
                        </Tooltip>
                    </ButtonsContainer>
                </Toolbar>
            </MuiAppBar>
        );
    }
}
