const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Tuk-Tuk Tracking API',
    version: '1.0.0',
    description: 'Real-Time Tuk-Tuk Tracking & Movement Logging System for Sri Lanka Police (NB6007CEM)'
  },
  servers: [
    { url: 'https://tuktuk-api.vercel.app', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Local Development' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/login'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      ValidationError: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      },
      Province: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Western' },
          code: { type: 'string', example: 'WP' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      District: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Colombo' },
          code: { type: 'string', example: 'COLOMBO' },
          province: { type: 'string', description: 'Province ObjectId' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Driver: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Kamal Perera' },
          licenseNumber: { type: 'string', example: 'LIC000001' },
          phone: { type: 'string', example: '0771234567' },
          nationalId: { type: 'string', example: 'NID000000001' },
          district: { type: 'string', description: 'District ObjectId' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Vehicle: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          registrationNumber: { type: 'string', example: 'TK0001' },
          driver: { type: 'string', description: 'Driver ObjectId' },
          district: { type: 'string', description: 'District ObjectId' },
          province: { type: 'string', description: 'Province ObjectId' },
          color: { type: 'string', example: 'Yellow' },
          year: { type: 'integer', example: 2020 },
          deviceId: { type: 'string', example: 'DEV000001' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Location: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          vehicle: { type: 'string', description: 'Vehicle ObjectId' },
          latitude: { type: 'number', example: 6.9271 },
          longitude: { type: 'number', example: 79.8612 },
          speed: { type: 'integer', example: 35 },
          timestamp: { type: 'string', format: 'date-time' }
        }
      },
      PoliceStation: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Colombo Fort Police Station' },
          code: { type: 'string', example: 'PS_COL_001' },
          address: { type: 'string', example: 'Fort, Colombo 01' },
          contactNumber: { type: 'string', example: '0112321111' },
          district: { type: 'string', description: 'District ObjectId' },
          province: { type: 'string', description: 'Province ObjectId' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'John Silva' },
                  email: { type: 'string', format: 'email', example: 'john@police.lk' },
                  password: { type: 'string', minLength: 6, example: 'secret123' },
                  role: { type: 'string', enum: ['admin', 'police', 'operator'], example: 'police' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully' },
          422: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and get a JWT token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@police.lk' },
                  password: { type: 'string', example: 'Lanka#2024' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful, returns JWT token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' }
                  }
                }
              }
            }
          },
          401: { description: 'Invalid credentials' },
          422: { description: 'Validation error' }
        }
      }
    },
    '/api/provinces': {
      get: {
        tags: ['Provinces'],
        summary: 'Get all provinces',
        responses: {
          200: { description: 'List of provinces', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Province' } } } } },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Provinces'],
        summary: 'Create a province (admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'code'],
                properties: {
                  name: { type: 'string', example: 'Western' },
                  code: { type: 'string', example: 'WP' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Province created' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden — admin only' },
          422: { description: 'Validation error' }
        }
      }
    },
    '/api/provinces/{id}': {
      get: {
        tags: ['Provinces'],
        summary: 'Get a province by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Province found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Province' } } } },
          404: { description: 'Province not found' }
        }
      }
    },
    '/api/provinces/{id}/districts': {
      get: {
        tags: ['Provinces'],
        summary: 'Get all districts in a province',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'List of districts', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/District' } } } } },
          404: { description: 'Province not found' }
        }
      }
    },
    '/api/districts': {
      get: {
        tags: ['Districts'],
        summary: 'Get all districts',
        responses: {
          200: { description: 'List of districts', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/District' } } } } },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Districts'],
        summary: 'Create a district (admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'code', 'province'],
                properties: {
                  name: { type: 'string', example: 'Colombo' },
                  code: { type: 'string', example: 'COLOMBO' },
                  province: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'District created' },
          403: { description: 'Forbidden — admin only' },
          422: { description: 'Validation error' }
        }
      }
    },
    '/api/districts/{id}': {
      get: {
        tags: ['Districts'],
        summary: 'Get a district by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'District found', content: { 'application/json': { schema: { $ref: '#/components/schemas/District' } } } },
          404: { description: 'District not found' }
        }
      }
    },
    '/api/drivers': {
      get: {
        tags: ['Drivers'],
        summary: 'Get all drivers (police or admin)',
        responses: {
          200: { description: 'List of drivers', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Driver' } } } } },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Drivers'],
        summary: 'Create a driver (admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'licenseNumber', 'phone', 'nationalId', 'district'],
                properties: {
                  name: { type: 'string', example: 'Kamal Perera' },
                  licenseNumber: { type: 'string', example: 'LIC000001' },
                  phone: { type: 'string', example: '0771234567' },
                  nationalId: { type: 'string', example: 'NID000000001' },
                  district: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Driver created' },
          403: { description: 'Forbidden — admin only' },
          422: { description: 'Validation error' }
        }
      }
    },
    '/api/drivers/{id}': {
      get: {
        tags: ['Drivers'],
        summary: 'Get a driver by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Driver found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Driver' } } } },
          404: { description: 'Driver not found' }
        }
      },
      put: {
        tags: ['Drivers'],
        summary: 'Update a driver (admin only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Driver updated' },
          403: { description: 'Forbidden — admin only' },
          404: { description: 'Driver not found' }
        }
      },
      delete: {
        tags: ['Drivers'],
        summary: 'Delete a driver (admin only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Driver deleted' },
          403: { description: 'Forbidden — admin only' },
          404: { description: 'Driver not found' }
        }
      }
    },
    '/api/vehicles': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get all vehicles (police or admin)',
        parameters: [
          { name: 'district', in: 'query', schema: { type: 'string' }, description: 'Filter by district ID' },
          { name: 'province', in: 'query', schema: { type: 'string' }, description: 'Filter by province ID' },
          { name: 'color', in: 'query', schema: { type: 'string' }, description: 'Filter by color' }
        ],
        responses: {
          200: { description: 'List of vehicles', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Vehicle' } } } } },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Vehicles'],
        summary: 'Register a vehicle (admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['registrationNumber', 'driver', 'district', 'province', 'color', 'year', 'deviceId'],
                properties: {
                  registrationNumber: { type: 'string', example: 'TK0001' },
                  driver: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' },
                  district: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' },
                  province: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' },
                  color: { type: 'string', example: 'Yellow' },
                  year: { type: 'integer', example: 2020 },
                  deviceId: { type: 'string', example: 'DEV000001' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Vehicle registered' },
          403: { description: 'Forbidden — admin only' },
          422: { description: 'Validation error' }
        }
      }
    },
    '/api/vehicles/{id}': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get a vehicle by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Vehicle found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
          404: { description: 'Vehicle not found' }
        }
      },
      put: {
        tags: ['Vehicles'],
        summary: 'Update a vehicle (admin only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  color: { type: 'string' },
                  year: { type: 'integer' },
                  driver: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Vehicle updated' },
          403: { description: 'Forbidden — admin only' },
          404: { description: 'Vehicle not found' }
        }
      },
      delete: {
        tags: ['Vehicles'],
        summary: 'Delete a vehicle (admin only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Vehicle deleted' },
          403: { description: 'Forbidden — admin only' },
          404: { description: 'Vehicle not found' }
        }
      }
    },
    '/api/locations': {
      post: {
        tags: ['Locations'],
        summary: 'Log a new location ping for a vehicle',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['vehicle', 'latitude', 'longitude'],
                properties: {
                  vehicle: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' },
                  latitude: { type: 'number', minimum: -90, maximum: 90, example: 6.9271 },
                  longitude: { type: 'number', minimum: -180, maximum: 180, example: 79.8612 },
                  speed: { type: 'integer', minimum: 0, example: 40 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Location logged' },
          422: { description: 'Validation error' }
        }
      }
    },
    '/api/locations/active': {
      get: {
        tags: ['Locations'],
        summary: 'Get the last known location of all active vehicles',
        responses: {
          200: { description: 'List of latest locations per vehicle', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Location' } } } } },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/locations/{vehicleId}/last': {
      get: {
        tags: ['Locations'],
        summary: 'Get the last known location of a specific vehicle',
        parameters: [{ name: 'vehicleId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Last location', content: { 'application/json': { schema: { $ref: '#/components/schemas/Location' } } } },
          404: { description: 'No location found for this vehicle' }
        }
      }
    },
    '/api/locations/{vehicleId}/history': {
      get: {
        tags: ['Locations'],
        summary: 'Get movement history of a vehicle',
        parameters: [
          { name: 'vehicleId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Start date filter' },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'End date filter' }
        ],
        responses: {
          200: { description: 'Location history', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Location' } } } } },
          404: { description: 'Vehicle not found' }
        }
      }
    },
    '/api/stations': {
      get: {
        tags: ['Police Stations'],
        summary: 'Get all police stations (police or admin)',
        parameters: [
          { name: 'district', in: 'query', schema: { type: 'string' }, description: 'Filter by district ID' },
          { name: 'province', in: 'query', schema: { type: 'string' }, description: 'Filter by province ID' }
        ],
        responses: {
          200: { description: 'List of police stations', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PoliceStation' } } } } },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Police Stations'],
        summary: 'Create a police station (admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'code', 'district', 'province'],
                properties: {
                  name: { type: 'string', example: 'Colombo Fort Police Station' },
                  code: { type: 'string', example: 'PS_COL_001' },
                  address: { type: 'string', example: 'Fort, Colombo 01' },
                  contactNumber: { type: 'string', example: '0112321111' },
                  district: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' },
                  province: { type: 'string', example: '64a1b2c3d4e5f6g7h8i9j0k1' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Station created' },
          403: { description: 'Forbidden — admin only' },
          422: { description: 'Validation error' }
        }
      }
    },
    '/api/stations/{id}': {
      get: {
        tags: ['Police Stations'],
        summary: 'Get a police station by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Station found', content: { 'application/json': { schema: { $ref: '#/components/schemas/PoliceStation' } } } },
          404: { description: 'Station not found' }
        }
      },
      put: {
        tags: ['Police Stations'],
        summary: 'Update a police station (admin only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  address: { type: 'string' },
                  contactNumber: { type: 'string' },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Station updated' },
          403: { description: 'Forbidden — admin only' },
          404: { description: 'Station not found' }
        }
      },
      delete: {
        tags: ['Police Stations'],
        summary: 'Delete a police station (admin only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Station deleted' },
          403: { description: 'Forbidden — admin only' },
          404: { description: 'Station not found' }
        }
      }
    }
  }
};

export default swaggerDocument;
