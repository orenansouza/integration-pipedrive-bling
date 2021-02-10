# Serverless API - Integração de Pipedrive com Bling

### Tecnologias que foram usadas: 

- Node 12.x
- Serverless Framework

### Objetivos da API: 
- Criar pedido na plataforma da Bling apartir de uma oportunidade gerada no pipedrive.

## Executar: 
Para executar o projeto será necessario a instalação do [Serverless Framework](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
e preencher as variáveis de ambiente que estão no `serverless.yml` na raiz do projeto.

**As variaveis a ser alteradas são**
- DATABASE_URL
- BLING_API_KEY

Após instalar o Serverless, terá que instalar as dependências do projeto executanto `yarn install` ou `npm install`.

E então executar o projeto com `sls offline` para rodar o Serverless em modo offline.

O projeto irá executar na porta `4000`.

Para rodar o projeto de modo que o Pipedrive consiga enxergar a aplicação foi utilizado o [Ngrok](https://ngrok.com/download) que irá gerar uma URL para você informar no webhook do Pipedrive como pede a [documentação do Pipedrive](https://developers.pipedrive.com/docs/api/v1/#!/Webhooks/addWebhook)

## Endpoints

### Post `/dev/orders`
Este endpoint tem a função de receber a oportunidade enviada pelo **Pipedrive** e cadastrar o produto e depois cadastrar o pedido na
**Bling** e no **Bando de dados**.

### GET `/dev/orders`
Este endpoint tem a função de retornar todos os pedidos cadastrados no Bando de dados.

Obs: Possui paginação.

***Queries***

- page: *number*
- limit: *number*


**Retorno**
```
"current": {
    "pagination": {
      "currentPage": 1,
      "limit": 10,
      "totalItems": 0
    },
    "orders": [
      {
        "_id": "",
        "pipedrive_id": "",
        "title": "",
        "client_name": "",
        "owner_name": "",
        "value": 0,
        "bling_id": "",
        "createdAt": "",
        "updatedAt": "",
        "__v": 0
      },
    ]
  }
}
```

