# REST API Fairmeet

## Requirements

- Nodejs > v.20.0

## How to run this program locally

Run this program in local development mode:

```bash
cp .env.example .env
nano .env
npm run build
npm run start
```
Configure the env based on your system.

TODO: Insert dockerbuild instructions

## How to contribute on this project

To develop this project the way it was designed you should run these commands (or similar depending on your system):

```bash
code ./{gitRootDirectory}/rest-api
cp .env.example .env
npm install
npm run dev
```

By using vscode you will be following the same configuration as the one of the development team.
For consistent formatting, install Prettier from the Visual Studio Code Marketplace.

`Complete the .env with the setup of your choice.`

For email testing:
- Signup at mailtrap.io
- Follow this guide to get the testing SMTP Credentials: [here](https://help.mailtrap.io/article/5-testing-integration)