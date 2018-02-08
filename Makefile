start_server:
	docker stop ssp-standard-editor; true
	docker rm ssp-standard-editor; true
	docker build -t ssp-standard-editor .
	docker run --name ssp-standard-editor --link ssp-standard-editor-db:postgres -p 8000:8000 -d ssp-standard-editor

start_db:
	docker stop ssp-standard-editor-db; true
	docker rm ssp-standard-editor-db; true
	docker build -t ssp-standard-editor-db db
	docker run -p 5432:5432 -d --name ssp-standard-editor-db ssp-standard-editor-db

fill_standards:
	docker exec -it ssp-standard-editor node /usr/src/app/init-data/standards.js; true

fill_standards_l:
	node ./init-data/standards.js

start:
	make start_db
	make start_server

push:
	make push_db
	make push_server
