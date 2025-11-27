# API REST de Órdenes con NestJS

API REST desarrollada con NestJS que permite consultar información de órdenes de compra con datos aleatorios.

## 🚀 Características

- Endpoint para consultar una orden específica por ID
- Endpoint para listar todas las órdenes
- Estatus aleatorios para simular diferentes estados de las órdenes
- Datos de prueba en formato JSON

## 📋 Requisitos

- Node.js (v14 o superior)
- npm

## 🛠️ Instalación

```bash
# Instalar dependencias (ya instaladas)
npm install
```

## ▶️ Ejecutar la aplicación

```bash
# Modo desarrollo (con hot reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La aplicación se ejecutará en `http://localhost:3000`

## 📡 Endpoints Disponibles

### Obtener todas las órdenes
```
GET http://localhost:3000/orders
```

### Obtener una orden específica
```
GET http://localhost:3000/orders/:orderId
```

**Ejemplos:**
- `GET http://localhost:3000/orders/ORD-2024-001`
- `GET http://localhost:3000/orders/ORD-2024-002`
- `GET http://localhost:3000/orders/ORD-2024-003`
- `GET http://localhost:3000/orders/ORD-2024-004`
- `GET http://localhost:3000/orders/ORD-2024-005`

## 📊 Respuesta de Ejemplo

```json
{
  "orderId": "ORD-2024-001",
  "status": "EN_TRANSITO",
  "customerName": "Juan Pérez",
  "customerEmail": "juan.perez@email.com",
  "orderDate": "2024-11-20T10:30:00Z",
  "totalAmount": 1299.99,
  "items": [
    {
      "productId": "PROD-001",
      "productName": "Laptop HP Pavilion",
      "quantity": 1,
      "unitPrice": 899.99,
      "subtotal": 899.99
    },
    {
      "productId": "PROD-002",
      "productName": "Mouse Inalámbrico",
      "quantity": 2,
      "unitPrice": 200.00,
      "subtotal": 400.00
    }
  ],
  "shippingAddress": "Av. Reforma 123, CDMX, México"
}
```

## 🎲 Estatus Posibles

Los estatus se asignan aleatoriamente en cada petición:
- `PENDIENTE`
- `CONFIRMADA`
- `EN_TRANSITO`
- `ENTREGADA`
- `CANCELADA`

## 📁 Estructura del Proyecto

```
src/
├── orders/
│   ├── data/
│   │   └── orders.json          # Datos de prueba
│   ├── dto/
│   │   └── order.dto.ts         # DTO de la orden
│   ├── interfaces/
│   │   └── order.interface.ts   # Interfaces y enums
│   ├── orders.controller.ts     # Controlador HTTP
│   ├── orders.service.ts        # Lógica de negocio
│   └── orders.module.ts         # Módulo de órdenes
├── app.module.ts                # Módulo principal
└── main.ts                      # Punto de entrada
```
