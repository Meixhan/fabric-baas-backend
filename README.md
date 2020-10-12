# fabric-baas-backend

fabric backend built with NestJS and MongoDB as data persistence.

## Setup

Add your mongodb uri to the "config/keys.ts file"
Add below host names in yout /etc/hosts

```
54.212.143.34   orderer.example.com
54.212.143.34   peer0.org1.example.com
54.212.143.34   peer0.org2.example.com
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
