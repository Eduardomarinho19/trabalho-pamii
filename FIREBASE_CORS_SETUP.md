# Configuração CORS para Firebase Storage

## Opção 1: Usando Google Cloud SDK

1. Instale o Google Cloud SDK: https://cloud.google.com/sdk/docs/install

2. Execute o comando:
```bash
gsutil cors set cors.json gs://lista-de-compras-50a2d.firebasestorage.app
```

## Opção 2: Via Console do Firebase (Mais Fácil)

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: "lista-de-compras-50a2d"
3. Vá em **Storage** no menu lateral
4. Clique na aba **Rules**
5. Adicione estas regras:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Clique em **Publicar**

## Solução Temporária (Para Desenvolvimento)

Como alternativa, você pode desabilitar temporariamente a verificação de segurança do navegador (apenas para desenvolvimento):

- **Chrome/Edge**: Feche o navegador e abra com:
```bash
chrome.exe --disable-web-security --user-data-dir="C:/temp/chrome-dev"
```

⚠️ **IMPORTANTE**: Isso é apenas para desenvolvimento! Use a configuração CORS correta para produção.
