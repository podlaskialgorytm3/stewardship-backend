FROM node:18-alpine

WORKDIR /app

# Kopiowanie plików package.json, package-lock.json oraz tsconfig.json
COPY package*.json tsconfig.json ./

# Zainstaluj zależności
RUN npm install

# Kopiowanie pozostałych plików źródłowych
COPY . .

# Zbuduj aplikację
RUN npm run build

EXPOSE 3002

CMD ["npx", "ts-node", "src/app.ts"]
