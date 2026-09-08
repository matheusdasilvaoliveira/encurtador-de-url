# Usamos a versão LTS do Node.js em uma imagem Alpine (super leve e segura)
FROM node:24-alpine

# Definimos o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiamos os arquivos de dependências primeiro (isso otimiza o cache do Docker)
COPY package*.json ./

# Instalamos as dependências
RUN npm install

# Copiamos o restante do código do projeto
COPY . .

# Expomos a porta que a aplicação vai rodar (conforme seu README)
EXPOSE 5000

# Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev"]