# Juste a little Makefile to easily manipulate docker-compose and dev environment

all: up

### Dev environment ###
# dev: database backend frontend

frontend:
	-cd frontend && npm run dev

backend:
	-cd backend && npm run dev

database:
	-docker-compose up -d postgres


### Prod environment ###

build:
	-docker-compose build

up:
	-docker-compose up -V -d

down:
	-docker-compose down -v

start:
	-docker-compose start

stop:
	-docker-compose stop

###

ps:
	-docker-compose ps

images:
	-docker-compose images

exec:
	-docker exec -it postgres-transcendence bash


.PHONY: frontend backend
