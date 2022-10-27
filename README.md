# debug-ctr-extension

> :warning: WIP (It only works for MacOS at the moment)

A Docker Extension to interactively debug distroless or slim containers that lack common utility tools.

https://user-images.githubusercontent.com/15997951/198212188-a6178727-28b3-429f-9045-8584320fbfa8.mov

## How does it work?

This Docker Extensions deploys the [debug-ctr](https://github.com/felipecruz91/debug-ctr) binary in your host and provides a UI in Docker Desktop that allows you to click on a running container to inspect it by opening a terminal into it. See [debug-ctr](https://github.com/felipecruz91/debug-ctr#option-1-debugging-adding-a-mount) for more information.

## Installation

Download the latest version of Docker Desktop and use the following command to install it:

```bash
  docker extension install felipecruz/debug-ctr-extension:latest
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/felipecruz91/debug-ctr-extension.git
```

Go to the project directory

```bash
  cd debug-ctr-extension
```

Build the extension

```bash
  docker build -t felipecruz/debug-ctr-extension:latest .
```

Install the extension

```bash
  docker extension install felipecruz/debug-ctr-extension:latest
```

Developing the frontend

```bash
  cd ui
  npm install
  npm start
```

This starts a development server that listens on port 3000.

You can now tell Docker Desktop to use this as the frontend source. In another terminal run:

```bash
  docker extension dev ui-source felipecruz/debug-ctr-extension:latest http://localhost:3000
```

In order to open the Chrome Dev Tools for your extension when you click on the extension tab, run:

```bash
  docker extension dev debug felipecruz/debug-ctr-extension:latest
```

Each subsequent click on the extension tab will also open Chrome Dev Tools. To stop this behaviour, run:

```bash
  docker extension dev reset felipecruz/debug-ctr-extension:latest
```
