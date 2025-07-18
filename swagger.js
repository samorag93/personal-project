const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies, Users & Comments API',
    description: 'API for managing users, movies, and comments in the project'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your Bearer token'
    }
  }
};

const outputFile = './swagger.json';
const endpointsFile = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFile, doc);
