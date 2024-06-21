FROM alpine:latest

RUN apk add --no-cache nginx curl

RUN mkdir -p /usr/share/nginx/html

COPY dist/ /usr/share/nginx/html

RUN rm -rf /var/cache/apk/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]