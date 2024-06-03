

| Topic | Key Considerations | 
|-------|--------------------|
| Chat application | Communication protocols, real-time messaging, message storage, presence management |
| Social network | User profiles, news feed generation, data storage, search, recommendation engines |
| E-commerce | Product catalog, shopping cart, checkout flow, payment processing, inventory management |
| Video streaming | Video encoding, storage and delivery, video player, user analytics, content recommendation |
| Search engine | Web crawler, index creation and storage, query processing, ranking algorithm |
| Map/reduce | Distributed computing, task scheduling, fault tolerance, data partitioning |
| Load balancing | Distribution algorithms, server health monitoring, auto-scaling, failover |
| Caching | Cache eviction policies, cache coherence, cache miss handling |
| Rate limiting | Token bucket algorithm, sliding window log algorithm, load shedding |
| Database sharding | Data partitioning, shard management, consistency, replication |
| Content delivery network (CDN) | Content distribution, caching, server selection, edge location mapping |
| Message queue | Message durability, message ordering, message size, message processing |
| Real-time analytics | Data ingestion, stream processing, data storage, data visualization |
| IoT | Device communication protocols, data ingestion, event processing, command and control |
| Blockchain | Consensus algorithms, transaction processing, data privacy, smart contracts |




| Question | System Design |
| --- | --- |
| Design a scalable system to find the most popular search queries in the last hour. | Use a distributed architecture with multiple servers, each handling a subset of incoming search queries. Store the queries in a time-series database and use a sliding window algorithm to determine the most popular queries in the last hour. |
| Design a distributed system for recommendation engine. | Use a collaborative filtering approach, where user behavior data is used to recommend items. Store user behavior data and item data in a distributed database such as Cassandra or HBase. Use MapReduce or Spark to compute recommendations based on the stored data. |
| Design a system to store and serve billions of images. | Use a distributed storage system such as Hadoop HDFS or Amazon S3. Store the images as binary blobs and use a content-based addressing system such as MD5 or SHA-1 to ensure uniqueness. Serve the images through a content delivery network (CDN) to improve performance. |
| Design a system to predict stock prices. | Collect real-time stock market data from various sources such as Bloomberg or Yahoo Finance. Store the data in a distributed database such as Cassandra or HBase. Use machine learning algorithms such as linear regression or neural networks to predict future stock prices based on historical data. |
| Design a system to detect fraudulent transactions in real-time. | Collect transaction data in real-time and store it in a distributed database such as Cassandra or HBase. Use machine learning algorithms such as decision trees or random forests to detect fraudulent transactions based on patterns in the data. |
| Design a system to manage ride-hailing requests in a city. | Use a distributed system with multiple servers handling incoming ride requests. Use a location-based approach to match drivers with riders. Store user and driver data in a distributed database such as Cassandra or HBase. Use a payment gateway to handle payment transactions. |
| Design a system to monitor and analyze the performance of a large-scale web application. | Use a distributed logging system to collect logs from various servers in the application stack. Store the logs in a distributed database such as Elasticsearch or HBase. Use data visualization tools such as Kibana or Grafana to analyze the logs and identify performance issues. |
| Design a system to manage inventory and orders for an e-commerce website. | Store product information, user information, and order information in a distributed database such as Cassandra or HBase. Use a payment gateway to handle payment transactions. Use a queuing system such as Kafka to handle incoming orders and ensure scalability. |
| Design a system to handle real-time chat messages for millions of users. | Use a distributed messaging system such as Kafka or RabbitMQ to handle real-time chat messages. Store user and message data in a distributed database such as Cassandra or HBase. Use a web socket protocol to enable real-time communication between users. |
| Design a system to perform sentiment analysis on social media data in real-time. | Use a distributed system to collect social media data in real-time from various sources such as Twitter or Facebook. Store the data in a distributed database such as Cassandra or HBase. Use machine learning algorithms such as Naive Bayes or SVM to perform sentiment analysis on the data. Use a web interface to display the results in real-time. |

