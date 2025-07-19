# Hotel Check-in/Checkout System

A Node.js TypeScript API for managing hotel check-ins and checkouts with amenity tracking and damage charges.

## Features

- **Check-in/Checkout Management**: Complete booking lifecycle with unique booking IDs
- **Amenity Tracking**: Monitor condition of hotel amenities (good/damaged/missing)
- **Damage Charges**: Automatic calculation of charges for damaged/missing amenities
- **Room Management**: Track room occupancy and assign amenities
- **User Management**: Guest registration and room assignment
- **Validation**: Request validation using express-validator
- **Database Indexing**: Optimized MongoDB queries with proper indexes
- **Auto-restart**: Development mode with nodemon for automatic restarts

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator
- **Development**: nodemon, ts-node
- **Testing**: Postman collection included

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd check_in_check_out
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/hotel
   PORT=3000
   ```

4. **Seed the Database**
   ```bash
   npm run seed
   ```
   This will create:
   - 20 realistic hotel amenities (Towel, Soap, Shampoo, etc.)
   - 100 rooms (101-200) with random amenity assignments

## Usage

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Check-in Guest
**POST** `/checkin/`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "roomNumber": "101"
}
```

**Response:**
```json
{
  "message": "User checked in",
  "bookingId": "uuid-string",
  "checkin": { /* checkin details */ }
}
```

#### 2. Check-out Guest
**POST** `/checkin/checkout`

**Request Body:**
```json
{
  "bookingId": "uuid-string",
  "amenities": [
    { "amenityId": "amenity-object-id", "condition": "good" },
    { "amenityId": "amenity-object-id", "condition": "damaged" }
  ]
}
```

**Response:**
```json
{
  "message": "User checked out",
  "totalCharge": 150,
  "checkin": { /* updated checkin details */ }
}
```

#### 3. Get All Active Bookings
**GET** `/checkin/bookings`

**Response:**
```json
[
  {
    "bookingId": "uuid-string",
    "user": { /* user details */ },
    "room": { /* room details */ },
    "checkinDate": "2024-01-01T00:00:00.000Z",
    "amenities": [ /* amenity details */ ]
  }
]
```

#### 4. Get Booking Details
**GET** `/checkin/:bookingId`

**Response:**
```json
{
  "bookingId": "uuid-string",
  "user": { /* user details */ },
  "room": { /* room details */ },
  "checkinDate": "2024-01-01T00:00:00.000Z",
  "checkoutDate": "2024-01-02T00:00:00.000Z",
  "totalCharge": 150,
  "amenities": [ /* amenity details */ ]
}
```

#### 5. Get All Amenities
**GET** `/amenity/`

**Response:**
```json
[
  {
    "_id": "amenity-object-id",
    "name": "Towel",
    "condition": "good",
    "charge": 100
  }
]
```

#### 6. Update Amenity Condition
**PATCH** `/amenity/:id`

**Request Body:**
```json
{
  "condition": "damaged"
}
```

**Response:**
```json
{
  "_id": "amenity-object-id",
  "name": "Towel",
  "condition": "damaged",
  "charge": 100
}
```

## Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `room`: ObjectId (optional, reference to Room)

### Room
- `number`: String (required, unique)
- `amenities`: Array of ObjectIds (reference to Amenity)
- `isOccupied`: Boolean (default: false)

### Amenity
- `name`: String (required, unique)
- `condition`: Enum ['good', 'damaged', 'missing'] (default: 'good')
- `charge`: Number (required)

### Checkin
- `bookingId`: String (required, unique)
- `user`: ObjectId (required, reference to User)
- `room`: ObjectId (required, reference to Room)
- `checkinDate`: Date (default: current date)
- `checkoutDate`: Date (optional)
- `amenities`: Array of objects with amenity and condition
- `totalCharge`: Number (optional)

## Validation Rules

### Check-in
- `name`: Required, string, not empty
- `email`: Required, valid email format
- `roomNumber`: Required, string, not empty

### Check-out
- `bookingId`: Required, string, not empty
- `amenities`: Required, array with minimum 1 item
- `amenities.*.amenityId`: Required, string, not empty
- `amenities.*.condition`: Required, one of ['good', 'damaged', 'missing']

### Amenity Update
- `id`: Required, valid MongoDB ObjectId
- `condition`: Required, one of ['good', 'damaged', 'missing']

## Testing

### Using cURL

1. **Check-in a guest:**
   ```bash
   curl -X POST http://localhost:3000/api/checkin/ \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "roomNumber": "101"
     }'
   ```

2. **Get all active bookings:**
   ```bash
   curl http://localhost:3000/api/checkin/bookings
   ```

3. **Check-out a guest:**
   ```bash
   curl -X POST http://localhost:3000/api/checkin/checkout \
     -H "Content-Type: application/json" \
     -d '{
       "bookingId": "your-booking-id",
       "amenities": [
         { "amenityId": "amenity-id", "condition": "good" }
       ]
     }'
   ```

### Using Postman

Import the `postman_collection.json` file into Postman for a complete set of pre-configured requests.

## Project Structure

```
src/
├── controllers/          # Route controllers
│   ├── checkinController.ts
│   └── amenityController.ts
├── models/              # Mongoose models
│   ├── User.ts
│   ├── Room.ts
│   ├── Amenity.ts
│   ├── Checkin.ts
│   └── index.ts
├── routes/              # Express routers
│   ├── checkin.ts
│   ├── amenity.ts
│   └── index.ts
├── utils/               # Utility functions
│   └── seeder.ts
├── app.ts               # Express app setup
└── index.ts             # Server entry point
```

## Scripts

- `npm run dev`: Start development server with auto-restart
- `npm run start`: Start production server
- `npm run build`: Build TypeScript to JavaScript
- `npm run seed`: Seed database with sample data

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

Error responses include detailed error messages and validation details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License 