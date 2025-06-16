# Build stage
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

# Production stage (nginx)
FROM nginx:alpine
# Mana bu qatorga e'tibor bering!
COPY --from=build /app/dist/AvtotestTechFrontend /
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]