## Publish OpenAPI Specification (OAS) to Postman Collection

In order to use this library you first need to [generate a Postman API token](https://www.postman.com/) and [add it as a secret to your repo](https://docs.github.com/en/actions/reference/encrypted-secrets)

Afterwards you need to find the UID of the Collection that you want to sync to. You can get this info executing the folowing curl:

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
          postmanCollectionUid: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          openApiSpec: (swagger.json) or (url address)
          options: |
            alwaysInheritAuthentication: true
            exampleParametersResolution: 'Example'
            folderStrategy: 'Paths'
            parametersResolution: 'Schema'
```
Note: The `options` list must be a multi-line string, as shown above. See [Actions Toolkit #184](https://github.com/actions/toolkit/issues/184#issuecomment-1198653452) and [Actions Toolkit #829](https://github.com/actions/toolkit/pull/829) for reasoning.

Note: All possible values of `options` and their usage can be found over here: [OPTIONS.md](https://github.com/postmanlabs/openapi-to-postman/blob/develop/OPTIONS.md).

Done!