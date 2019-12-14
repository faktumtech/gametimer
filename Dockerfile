# gametimer dockerfile
# create new nginx image and copy build gametimer app

# build (prefix with 'cfbutt/' if you want to push to docker hub):
# docker build -t gametimer .

# push to docker hub
# docker push ???

# save image for deploy without using hub:
# docker save -o gametimer.docker.tar gametimer

# send image to remote host
# rsync -rv --verbose --progress --rsh='ssh -p[PORT]' *.docker.tar [USER]@[IP]:[PATH]

# execute commands on remote host
# ssh -p[PORT] -4 [USER]@[IP] '[command / docker command]'

# import image without using hub:
# docker load -i gametimer.docker.tar

# run as daemon with (exposing 3006):
# docker run --name gametimer_container -d --restart=unless-stopped -p 3006:80 gametimer

# stop container
# docker stop gametimer_container

# stop and remove container
# docker rm -f gametimer_container


# use nginx:alpine
FROM nginx:alpine

# Build to nginx web dir
COPY dist /usr/share/nginx/html

# Document where a service is available, but not create any mapping to the host
EXPOSE 80