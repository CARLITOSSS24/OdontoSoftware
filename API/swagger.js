import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDocs = (app, port) => {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API de Odontología",
        version: "1.0.0",
        description: "Documentación de la API para el sistema de odontología",
      },
      servers: [
        {
          url: `http://localhost:${port}/api`
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    },
    apis: [ 
      "./src/routes/rutasOdoLogin.js",
      "./src/routes/rutasOdoPassword.js",
      "./src/routes/rutasOdoUser.js",       
      "./src/routes/rutasOdoPermisos.js", 
      "./src/routes/rutasOdoServicios.js",  
      "./src/routes/rutasOdoHistoriales.js", 
      "./src/routes/rutasOdoDoctora.js",
      "./src/routes/rutasOdoCargo.js",
      "./src/routes/rutasOdoConsultorios.js", 
      "./src/routes/rutasOdoCitas.js"   
    ]
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);
};

export default swaggerDocs;



