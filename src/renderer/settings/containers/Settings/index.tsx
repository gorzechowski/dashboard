import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

const StyledGrid = styled(Grid)`
    && {
        height: 100%;
        background-color: ${({ theme }) => theme.palette.background.default};
    }
`;

export class Settings extends React.PureComponent<any, any> {
    public render() {
        return (
            <StyledGrid container direction='column'>
                {this.props.children}
            </StyledGrid>
        );
    }
}
