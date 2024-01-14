FROM node:lts-alpine
WORKDIR /prisma
COPY prisma/ ./
COPY .env ./
RUN yarn global add prisma
RUN npx prisma generate dev
EXPOSE 5555
CMD ["prisma", "studio"]
# CMD ["prisma", "generate"]