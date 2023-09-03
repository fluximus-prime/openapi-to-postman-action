## Publish OpenAPI Specification (OAS) to Postman Collection

In order to use this library you first need to [generate a Postman API token](https://www.postman.com/) and [add it as a secret to your repo](https://docs.github.com/en/actions/reference/encrypted-secrets)

Afterwards you need to find the ID of the collection that you want to sync to. You can get this info executing the folowing curl:

```
curl --location \
  --request GET \
  'https://api.getpostman.com/collections' \
  --header 'X-API-Key: apiKey'
```

### Configuring

It is pretty straightforward:

```
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: fluximus-prime/openapi-to-postman-action@v1
        with:
          postmanApiKey: ${{ secrets.POSTMAN_API_KEY }}
          postmanCollectionId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          openApiSpec: (swagger.json) or (url address)
```

Done!