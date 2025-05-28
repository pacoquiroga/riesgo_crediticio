# Sistema de Evaluación de Riesgo Crediticio

Este sistema permite evaluar el riesgo crediticio de personas naturales y jurídicas, calculando su nivel de riesgo y determinando la aprobación de préstamos basado en diversos factores.

## Requisitos Previos

- Docker
- Node.js (v14 o superior)
- npm (v6 o superior)

## Configuración del Entorno

### 1. Configuración de la Base de Datos PostgreSQL

Primero, necesitamos ejecutar un contenedor de PostgreSQL:

```bash
# Crear y ejecutar el contenedor de PostgreSQL
docker run --name postgres-banco -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=bancodb -p 5432:5432 -d postgres
```

Para verificar que el contenedor está corriendo:
```bash
docker ps
```

### 2. Instalación de Dependencias

```bash
# Instalar dependencias del proyecto
pnpm install
```

### 3. Ejecutar la Aplicación

```bash
# Ejecutar en modo desarrollo
pnpm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

## Uso de la API

### 1. Evaluar Riesgo de Cliente Natural

```bash
curl -X POST http://localhost:3000/evaluar-riesgo \
-H "Content-Type: application/json" \
-d '{
    "tipoCliente": "NATURAL",
    "nombre": "Juan Pérez",
    "puntajeCrediticio": 720,
    "deudasActuales": [
        {
            "monto": 800,
            "plazoMeses": 12
        }
    ],
    "montoSolicitado": 5000,
    "plazoEnMeses": 24,
    "edad": 35,
    "ingresoMensual": 4500
}'
```

### 2. Evaluar Riesgo de Cliente Jurídico

```bash
curl -X POST http://localhost:3000/evaluar-riesgo \
-H "Content-Type: application/json" \
-d '{
    "tipoCliente": "JURIDICA",
    "nombre": "Empresa XYZ",
    "puntajeCrediticio": 750,
    "deudasActuales": [
        {
            "monto": 100000,
            "plazoMeses": 24
        }
    ],
    "montoSolicitado": 200000,
    "plazoEnMeses": 36,
    "antiguedadAnios": 8,
    "ingresoAnual": 1000000,
    "empleados": 45
}'
```

### 3. Consultar Historial de Evaluaciones

```bash
curl http://localhost:3000/evaluar-riesgo/{clienteId}/historial
```

## Estructura de Respuestas

### Evaluación de Riesgo

```json
{
    "nivelRiesgo": "BAJO|MEDIO|ALTO",
    "aprobado": true|false,
    "puntajeFinal": 85,
    "mensaje": "Cliente apto para préstamo con condiciones preferenciales",
    "tasaInteres": 6.5,
    "plazoAprobado": 24
}
```

### Historial de Evaluaciones

```json
[
    {
        "id": 1,
        "clienteNombre": "Juan Pérez",
        "tipoCliente": "NATURAL",
        "montoSolicitado": 5000,
        "plazoEnMeses": 24,
        "nivelRiesgo": "BAJO",
        "aprobado": true,
        "fechaConsulta": "2024-03-19T15:30:00.000Z",
        "clienteId": 1
    }
]
```

## Comandos Útiles de Docker

```bash
# Detener el contenedor
docker stop postgres-banco

# Iniciar el contenedor
docker start postgres-banco

# Ver logs del contenedor
docker logs postgres-banco

# Eliminar el contenedor
docker rm -f postgres-banco
```

## Notas Adicionales

- La base de datos se crea automáticamente gracias a la configuración `synchronize: true` en el módulo TypeORM.
- Los datos de conexión a la base de datos están configurados en `src/app.module.ts`.
- El sistema evalúa el riesgo basado en:
  - Puntaje crediticio
  - Ratio de deuda
  - Monto solicitado vs ingresos
  - Tipo de cliente (Natural o Jurídico)

## Solución de Problemas

1. Si el contenedor no inicia:
```bash
# Verificar los logs
docker logs postgres-banco
```

2. Si no se puede conectar a la base de datos:
```bash
# Verificar que el contenedor está corriendo
docker ps | grep postgres-banco

# Verificar que el puerto está disponible
netstat -an | grep 5432
```

3. Si necesitas reiniciar la base de datos:
```bash
docker rm -f postgres-banco
# Luego volver a ejecutar el comando de creación del contenedor
```
