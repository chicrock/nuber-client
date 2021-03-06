# nuber-client

Client for the Uber Clone. ReactJS, Apollo, Typescript

## Install

### Create project

```bash
create-react-app nuber-client --scripts-version=react-scripts-ts
```

### apollo-boost

```bash
yarn add apollo-boost graphql react-apollo
```

### styled-components

```bash
yarn add styled-components
yarn add --dev @types/styled-components
```

### styled-reset

```bash
yarn add styled-reset
```

### react-router-dom

```bash
yarn add react-router-dom
yarn add --dev @types/react-router-dom
```

### react-helmet

```bash
yarn add react-helmet
yarn add --dev @types/react-helmet
```

### react-toastify

```bash
yarn add react-toastify
```

### apollo for codegen

```bash
yarn global add apollo
```

### react-sidebar

```bash
yarn add react-sidebar
yarn add --dev @types/react-sidebar
```

### google maps

```bash
yarn add google-maps-react
yarn add --dev @types/google-maps-react @types/googlemaps
```

### dotenv

```bash
yarn add dotenv
```

- Get the Google Maps Javascript API key from [Google Console](https://console.cloud.google.com/)
- Need Geocoding API authorization.

### for deploy

```json
  // Add this configs in package.json
  "scripts": {
    ...
    "deploy": "gh-pages -d dist"
    ...
  },
  "homepage": "https://chicrock.github.io/nuber-client"
```

## Screens

### Logged Out

    - [x] Home
    - [x] Phone Login
    - [x] Verify Phone Number
    - [x] Social Login

### Logged In

    - [x] Home
    - [x] Ride
    - [x] Chat
    - [x] Edit Account
    - [x] Settings
    - [x] Saved Places
    - [x] Add Place
    - [x] Find Address
    - [ ] Challenge: Ride History
    - [ ] Challenge: Email Sign In

## Resource

### iconmomster

- Can Get the free icons from [Iconmonstr](https://iconmonstr.com/)
- And Use like this with svg

```javascript
<svg
  width="24"
  height="24"
  xmlns="http://www.w3.org/2000/svg"
  fill-rule="evenodd"
  clip-rule="evenodd"
>
  <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z" />
</svg>
```

## Apollo Codegen

### Codegen Install

```bash
yarn global add apollo
```

### Setup

- Add below scripts on pacakage.json

```json
"precodegen": "apollo schema:download --endpoint=http://localhost:4000/graphql",
"codegen": "apollo codegen:generate src/types/api.d.ts --queries='src/**/*.queries.ts' --addTypename --localSchemaFile schema.json --target typescript --outputFlat"
```

### Generate types

```bash
yarn run codegen
```

## Social login

### Facebook Login Install

```bash
yarn add react-facebook-login
```

### Eject Apollo boost

```bash
yarn add apollo-cache-inmemory apollo-client apollo-link apollo-link-error apollo-link-http apollo-link-state apollo-link-ws apollo-utilities subscriptions-transport-ws
```

### GET App ID

- [Facebook developer](https://developers.facebook.com)
- Create App on facebook developer site

## Upload Image Files

### Setup Cloudinary

- Sign up
- Add upload preset with Unsigned in Settings

### Upload image with axios

```bash
yarn add axios
```

```javascript
const formData = new FormData();
formData.append("file", files[0]);
formData.append("api_key", CLOUDINARY_KEY);
formData.append("upload_preset", CLOUDINARY_PRESET);
formData.append("timestamp", String(Date.now() / 1000));

const {
  data: { secure_url },
} = await axios.post(
  "https://api.cloudinary.com/v1_1/[cloudinary_user_name]/image/upload",
  formData
);
```

## Use Dotenv

- If you want to use dotenv on reactjs project that create with create-react-app, you should add prefix like `` on your environmental varialbes.

### .env

```bash
REACT_APP_CLOUDINARY_KEY=
REACT_APP_CLOUDINARY_PRESET=
REACT_APP_GOOGLE_MAPS_API_KEY=
```
