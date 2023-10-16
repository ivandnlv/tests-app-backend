const swaggerAutogen = require('swagger-autogen');

const outputFile = './src/utils/swagger_output.json'; // Путь к файлу для сохранения документации Swagger
const endpointsFiles = ['./src/main.ts']; // Путь к вашему главному файлу приложения

const doc = {
  info: {
    title: 'Tests App Api',
    description: 'Api для платформы по решению и созданию тестов',
    version: '1.0.0',
  },
};

const routes = ['./src/routes'];

swaggerAutogen(outputFile, endpointsFiles, doc);
