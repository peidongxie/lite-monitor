# backend

<p align="center">
  <img src="https://raw.githubusercontent.com/peidongxie/lite-monitor/main/packages/frontend/public/logo.png">
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/peidongxie/lite-monitor" />
  <img src="https://img.shields.io/github/package-json/v/peidongxie/lite-monitor" />
</p>

The frontend of a software system for processing data from event tracking

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [Related Efforts](#related-efforts)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

LiteMonitor started with a database online examination real-time monitoring system. During the development of the system, I found that I needed a event tracking library that could meet the following characteristics:

- Lightweight
- Low invasiveness
- Well defined
- Good compatibility

As a result, I built a JavaScript library and published it to npm. In February 2021, I started developing version 1.0 of the project.

## Installation

This app uses Node.js and pnpm. Please make sure they are installed locally.

```sh
$ git clone https://github.com/peidongxie/lite-monitor
$ cd lite-monitor/packages/frontend
$ pnpm install
```

## Usage

This app can be started in production mode or development mode.

For production mode:

```sh
$ pnpm build
$ pnpm start
```

For development mode:

```sh
$ pnpm dev
```

## Related Efforts

- [@lite-monitor/base](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-base)
- [@lite-monitor/node](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-node)
- [@lite-monitor/web](https://github.com/peidongxie/lite-monitor/tree/main/packages/lite-monitor-web)
- [Chart.js](https://github.com/chartjs/Chart.js)
- [Material-UI](https://github.com/mui-org/material-ui)
- [Next.js](https://github.com/vercel/next.js)
- [React](https://github.com/facebook/react)
- [SWR](https://github.com/vercel/swr)
- [clsx](https://github.com/lukeed/clsx)

## Maintainers

[@peidongxie](https://github.com/peidongxie)

## Contributing

Feel free to open an [issue](https://github.com/peidongxie/lite-monitor/issues/new) or [PR](https://github.com/peidongxie/lite-monitor/compare).

## License

[MIT](../../LICENSE) © 谢沛东
