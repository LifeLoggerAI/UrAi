FROM node:20-bookworm

# Install ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /srv
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY server.js ./

ENV PORT=8080
CMD ["npm","start"]
