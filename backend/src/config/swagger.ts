import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "AI Career Hub API",
      version: "1.0.0",
      description: "AI Career Hub Backend API",
    },

    servers: [
      {
        url: "https://aicareerhub-site.duckdns.org/api",
        description: "Production",
      },
      {
        url: "http://localhost:3000",
        description: "Local",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [path.join(__dirname, "../routes/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(options);
