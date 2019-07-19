import { ipcRenderer } from 'electron';
import * as React from 'react';
import { render } from 'react-dom';
import App from './settings/App';
import { ipcSendFactory, IpcInterface } from '../ipc/Renderer';
// TODO make it a dependency when new version of qmlweb will be published
import './vendor/qt.js';
import './vendor/qmlweb.parser.js';

render(<App ipc={{
    query: ipcSendFactory(ipcRenderer),
    command: ipcSendFactory(ipcRenderer),
} as IpcInterface} />, document.getElementById('app'));
