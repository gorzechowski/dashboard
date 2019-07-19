import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';

interface TabDefinitionProps {
    tab: any;
    onQmlChanged: (index: number, value: string) => void;
    onRemoveClicked: (index: number) => void;
}

const Textarea = styled.textarea`
    width: 100%;
    height: 100%;
`;

export class TabDefinition extends React.Component<TabDefinitionProps, any> {
    public render() {
        const { tab, onQmlChanged, onRemoveClicked } = this.props;

        return (
            <Paper>
                <Card>
                    <CardContent>
                        <Typography variant='h4'>
                            #{tab.index}
                        </Typography>

                        <Textarea
                            value={tab.qml}
                            rows={30}
                            onChange={
                                (event: any) => onQmlChanged(tab.index, event.target.value)
                            }
                        />
                    </CardContent>
                    <CardActions>
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={() => onRemoveClicked(tab.index)}
                    >
                        Remove
                    </Button>
                    </CardActions>
                </Card>
            </Paper>
        );
    }
}
