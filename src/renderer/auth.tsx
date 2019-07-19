import { ipcRenderer } from 'electron';
import * as React from 'react';
import { render } from 'react-dom';
import App from './auth/App';
import { ipcSendFactory, IpcInterface } from '../ipc/Renderer';

render(<App ipc={{
    query: ipcSendFactory(ipcRenderer),
    command: ipcSendFactory(ipcRenderer),
} as IpcInterface} />, document.getElementById('app'));
