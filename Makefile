.PHONY: deploy-api
deploy-api:
	sls deploy --aws-profile personal --region eu-west-2 --stage production

.PHONY: deploy-ui
deploy-ui:
	REACT_APP_API_URL="https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query" sls client deploy --no-confirm --aws-profile personal --stage production --region eu-west-2

.PHONY: build-ui
build-ui:
	cd ui && npm install && REACT_APP_API_URL="https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query" npm run build

.PHONY: build-api
build-api:
	cd api && npm install

.PHONY: deploy
deploy: build-api build-ui deploy-api deploy-ui
 
.PHONY: serve-ui
serve-ui:
	cd ui && REACT_APP_API_URL="http://localhost:5000/dev/query" npm run start

.PHONY: serve-api
serve-api:
	AWS_ACCESS_KEY_ID='access-key' AWS_SECRET_ACCESS_KEY='secret-key' sls offline start -r eu-west-2

.PHONY: serve
serve: serve-api serve-ui
