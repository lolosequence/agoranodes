# Strapi production Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Build Strapi (compiles TypeScript and admin panel)
ENV NODE_ENV=production
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Create uploads directory
RUN mkdir -p public/uploads

EXPOSE 1337

ENV HOST=0.0.0.0
ENV PORT=1337

CMD ["npm", "run", "start"]
