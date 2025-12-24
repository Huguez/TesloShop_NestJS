<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo API

### Run in development

1.- Clone the repository
```
git clone https://github.com/Huguez/TesloShop_NestJS.git
```
2.- Install dependencies
```
npm install
```

3.- rename .env.template to .env and write variables
```
DB_HOST     = ************
DB_PORT     = ************
DB_NAME     = ************
DB_USER     = ************
DB_PASSWORD = ************
PORT        = ************
HOST_API    = ************
```

4.- Set up the database with Docker
```
docker-compose up -d
```

6.- Run the service in development
```
npm run dev
```

7.- Execute Seed
```
GET http://localhost:3000/api/seed
```
