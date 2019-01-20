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

### prop-types

```bash
yarn add prop-types
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

## Screens

### Logged Out

    - [x] Home
    - [x] Phone Login
    - [x] Verify Phone Number
    - [x] Social Login

### Logged In

    - [ ] Home
    - [ ] Ride
    = [x] Edit Account
    - [x] Settings
    - [ ] Saved Places
    - [ ] Add Place
    - [ ] Find Address
    - [ ] Challenge: Ride History

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
