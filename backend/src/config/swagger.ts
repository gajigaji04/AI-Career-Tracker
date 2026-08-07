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

  // swagger-jsdoc's bundled glob (v9+) treats "\" as an escape char, not a path
  // separator, so a Windows-style path silently matches nothing — normalize to "/".
  // ".{ts,js}" covers both `npm run dev` (ts-node, .ts source) and the compiled
  // production build (dist/, .js only).
  apis: [path.join(__dirname, "../routes/*.{ts,js}").split(path.sep).join("/")],
};

export const swaggerSpec = swaggerJsdoc(options);
