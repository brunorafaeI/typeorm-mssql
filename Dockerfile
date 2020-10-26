FROM logstash:7.9.3

COPY logstash/drivers/mssql-jdbc-8.4.1.jre11.jar logstash-core/lib/jars/

# RUN rm -f /usr/share/logstash/pipleline/logstash.conf

# ADD logstash/pipeline/ /usr/share/logstash/pipeline/
ADD logstash/config /usr/share/logstash/config/

RUN bin/logstash-plugin install --version=3.1.5 logstash-output-mongodb logstash-output-redis
