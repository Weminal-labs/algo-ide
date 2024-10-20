docker build --platform linux/amd64 -t python-algorand .
docker tag python-algorand:latest lekhacthanhtung/python-algorand:latest
docker push lekhacthanhtung/python-algorand:latest