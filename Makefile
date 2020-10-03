.PHONY: deploy-api
deploy-api:
	sls deploy --aws-profile personal --region eu-west-2 --stage production

.PHONY: deploy-ui
deploy-ui:
	REACT_APP_API_URL="https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query" sls client deploy --no-confirm --aws-profile personal --stage production --region eu-west-2

.PHONY: build-ui
build-ui:
	cd ui && npm install && npm run build

.PHONY: build-api
build-api:
	cd api && npm install

.PHONY: deploy
deploy: build-api build-ui deploy-api deploy-ui
 
.PHONY: serve
serve:
	cd ui && REACT_APP_API_URL="https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query" npm run start
