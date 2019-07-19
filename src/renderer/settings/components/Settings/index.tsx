import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

interface AppProps {
    checked: boolean;
    onChange: (name: string, checked: boolean) => void;
    name: string;
    children: string;
}

interface AppState {
    tabs: any[];
    settings: any[];
}

export class SettingSwitch extends React.Component<AppProps, AppState> {
    public render() {
        const { checked, onChange, name, children } = this.props;

        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={checked}
                        onChange={
                            event => onChange(
                                event.target.value,
                                event.target.checked,
                            )
                        }
                        value={name}
                        color='secondary'
                    />
                }
                label={children}
            />
        );
    }
}
