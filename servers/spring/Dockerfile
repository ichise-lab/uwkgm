FROM maven
COPY package /spring

WORKDIR /spring
RUN mvn package

CMD java -jar /spring/target/uwkgm-spring-1.0.jar --server.port=80
