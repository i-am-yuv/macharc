# Using nginx to serve the build files
FROM nginx

LABEL author="kirpal" macharc="macharc frontend"

EXPOSE 80

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/studio /usr/share/nginx/html
COPY nginx.conf /etc/nginx