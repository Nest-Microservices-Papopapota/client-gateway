## Client Gateway
El Gateway es punto de comunicación entre nuestro clientes y nuestros servicios.


## Dev
1. Clonal el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `env.template`
4. Tener levantados los microservicios que se van a consumir
5. Levantar el proyecto con `npm run start:dev`


## Nats
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```

