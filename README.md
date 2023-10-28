# Shopzone

Rest API using **Express**, **TypeScript** and **MongoDB**

### Installing

Clone the repository to your local machine

```shell
git clone https://github.com/gabriel-dsdc/shopzone.git
```

Navigate into root of repository

```shell
cd shopzone
```

Install dependencies

```shell
npm install
```

Create a `.env` file based on the `.env.example` file and populate following variables

```
PORT=3001
MONGODB_URI=<mongodb-connection-uri>
JWT_SECRET=<your-jwt-secret-key>

CLIENT_ID=<imgur-api-client-id>
CLIENT_SECRET=<imgur-api-client-secret>
REFRESH_TOKEN=<imgur-api-refresh-token>
ALBUM_HASH=<imgur-album-hash>
APP_URL=<app-url-for-stripe>
STRIPE_SECRET_KEY=<stripe-secret-key>
endpointSecret=<stripe-webhook-secret>
```

**\*Imgur** is optional as it is only used to upload product images, but you can use external image URLs instead.  
**Stripe** variables are only used in the payment route, you can use the application without them.\*

### Running the application

Development

```shell
npm run dev
```

Production

```
npm start
```

## Rest API

### Register a new user

#### Request

`POST {{hostname}}/users/register`

```json
{
  "name": "",
  "email": "",
  "password": "",
  "confirmPassword": ""
}
```

#### Response

```json
{
  "token": ""
}
```

### Login

#### Request

`POST {{hostname}}/users/login`

```json
{
  "email": "",
  "password": ""
}
```

#### Response

```json
{
  "token": ""
}
```

### Get user (yourself or admin)

#### Request

`GET {{hostname}}/users/:id`

#### Response

```json
{
  "id": "",
  "name": "",
  "email": "",
  "role": ""
}
```

### Update user

#### Request

`PUT {{hostname}}/users/:id`

```json
{
  "name": "",
  "email": "",
  "password": "",
  "confirmPassword": ""
}
```

#### Response

```json
{
  "name": "New name",
  "email": "new@email.com"
}
```

### Delete user

#### Request

`DELETE {{hostname}}/users/:id`

#### Response

```json
{
  "message": "User deleted successfully!"
}
```

### Create product (admin or seller)

#### Request

`POST {{hostname}}/products`

```json
{
  "name": "",
  "images": ["https://image.png"],
  "description": "",
  "price": 0,
  "quantity": 1,
  "category": "",
  "brand": "", // Optional
  "authors": "" // Optional
}
```

#### Response

```json
{
  "name": "",
  "images": ["https://image.png"],
  "description": "",
  "price": 0,
  "quantity": 1,
  "category": "",
  "brand": "", // Optional
  "authors": "" // Optional
}
```

### List products

#### Request

`GET {{hostname}}/products`

#### Response

```json
[
  {
    "id": "",
    "name": "",
    "images": ["https://image.png"],
    "description": "",
    "price": 0,
    "quantity": 1,
    "category": "",
    "brand": "", // Optional
    "authors": "" // Optional
  }
]
```

### Get product

#### Request

`GET {{hostname}}/products/:id`

#### Response

```json
{
  "id": "",
  "name": "",
  "images": ["https://image.png"],
  "description": "",
  "price": 0,
  "quantity": 1,
  "category": "",
  "brand": "", // Optional
  "authors": "" // Optional
}
```

### Update product

#### Request

`PUT {{hostname}}/products/:id`

```json
{
  "name": "",
  "images": ["https://image.png"],
  "description": "",
  "price": 0,
  "quantity": 1,
  "category": "",
  "brand": "", // Optional
  "authors": "" // Optional
}
```

### Delete product

#### Request

`DELETE {{hostname}}/products/:id`

### Create user (admin)

#### Request

`POST {{hostname}}/admin/createUser`

```json
{
  "name": "",
  "email": "",
  "password": "",
  "confirmPassword": "",
  "role": "client" // client or admin
}
```

### List users (admin)

#### Request

`GET {{hostname}}/admin/users`

#### Response

```json
[
  {
    {
      "name": "",
      "email": "",
      "password": "",
      "confirmPassword": "",
      "role": "client" // client or admin
    }
  }
]
```

### Get configs

#### Request

`GET {{hostname}}/admin/getConfigs`

#### Response

```json
{
  "allowNewUsers": true,
  "allowUserModifications": true
}
```

### Update configs

#### Request

`PUT {{hostname}}/updateConfigs`

```json
{
  "allowNewUsers": false,
  "allowUserModifications": false
}
```

### Built With

- [Expressjs](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com) - NoSQL Database
- [Stripe](https://github.com/stripe/stripe-node) - Payment API
- [Imgur](https://github.com/keneucker/imgur) - Image API
