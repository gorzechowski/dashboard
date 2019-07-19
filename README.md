[![Build Status](https://travis-ci.org/gorzechowski/dashboard.svg?branch=master)](https://travis-ci.org/gorzechowski/dashboard)

# Dashboard

![Showcase](https://user-images.githubusercontent.com/4973929/61528919-4b450280-aa20-11e9-9c46-8897856bb8c3.gif)

## Description

![Logo](https://user-images.githubusercontent.com/4973929/61528935-55ff9780-aa20-11e9-9e68-5ff1aa5979e3.png)

Compose all dashboards in one application using QML language.

## Features

- Displays single or multiple web pages in one tab basing on grid layout,
- Supports multiple tabs including switch timer customizable per each tab,
- Automatically refreshes web pages with customizable intervals provided for each page separately.

## Getting started

Find the latest version of Dashboard built for your platform [here](https://github.com/gorzechowski/dashboard/releases). If it's not there or you want to build youreself, see instructions below.

Application will enter to `Settings` (if run for the first time) where you need to define tabs and adjust other settings. Use `Add tab` button to define as many tabs as you want and save when done. `Settings` my be entered later if needed.

Tabs definitions and settings are stored locally in SQLite database - `database.sqlite` - which may be found in locations:

- `%APPDATA%/dashboard` on Windows
- `$XDG_CONFIG_HOME/dashboard` or `~/.config/dashboard` on Linux

## Build

Get the code:

```
git clone git@github.com:gorzechowski/dashboard.git && cd dashboard
```

Install dependencies `npm install`

Build application `npm run build`

Run `npm run start`

## Built with

- [QmlWeb](https://github.com/qmlweb/qmlweb) - browser-based QML engine
- [Electron](https://github.com/electron/electron)
- [React](https://github.com/facebook/react)

## Reference documentation

- [Dashboard QML Types](/docs/QmlTypes.md) - list of types provided by `Dashboard` import

## Roadmap

See the [open issues](https://github.com/gorzechowski/dashboard/issues) for a list of proposed features (and known issues).

## License

Distributed under the MIT License. See the [LICENSE](/LICENSE) for more informations.
