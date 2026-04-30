# Database Types — Narration Script
## Total: ~150 seconds (4500 frames @ 30fps)

---

### INTRO (0s – 3s | Frames 0–90)
> "Let's explore the different types of databases — and when to use each one."

---

### 1. RELATIONAL / SQL (3s – 18s | Frames 90–540)
> "First up — relational databases. These are the workhorses of the industry.
> PostgreSQL, MySQL, SQL Server, Oracle — they all follow the same core idea:
> structured tables with rows and columns, linked by foreign keys.
>
> They're ACID-compliant, meaning your transactions are reliable — 
> perfect for banking, e-commerce, and any system where data integrity is non-negotiable.
>
> If you need complex joins, strict schemas, and battle-tested reliability — 
> relational databases are your foundation."

---

### 2. DOCUMENT STORE (18s – 33s | Frames 540–990)
> "Next — document databases like MongoDB, CouchDB, and Firestore.
> Instead of rigid tables, they store data as flexible JSON or BSON documents.
>
> This makes them ideal for content management systems, user profiles,
> and real-time applications where your data shape evolves frequently.
>
> They scale horizontally with ease, which is why they're the go-to 
> for startups and mobile backends that need to iterate fast."

---

### 3. KEY-VALUE STORE (33s – 48s | Frames 990–1440)
> "Key-value stores are the simplest and fastest database type.
> Redis, DynamoDB, Memcached — they map a key directly to a value.
>
> Think of them for session management, caching, shopping carts,
> leaderboards, and rate limiting — anywhere you need sub-millisecond lookups.
>
> Redis can even run entirely in memory, making it blazing fast
> for real-time use cases like feature flags and counters."

---

### 4. WIDE-COLUMN / COLUMNAR (48s – 63s | Frames 1440–1890)
> "Wide-column databases like Cassandra, HBase, and ScyllaDB
> organize data into column families rather than traditional rows.
>
> They're designed for massive write throughput and horizontal scaling
> across multiple data centers.
>
> This makes them perfect for time-series data, IoT sensor streams,
> event logging, and analytics pipelines where you're writing
> millions of events per second."

---

### 5. GRAPH DATABASE (63s – 78s | Frames 1890–2340)
> "Graph databases — like Neo4j, Amazon Neptune, and ArangoDB — 
> are built for connected data.
>
> Instead of tables, you work with nodes and edges, 
> making relationship traversals incredibly efficient.
>
> They shine in social networks, fraud detection, 
> knowledge graphs, and recommendation engines — 
> anywhere the relationships between data points 
> matter more than the data itself."

---

### 6. SEARCH ENGINE (78s – 93s | Frames 2340–2790)
> "Search engines like Elasticsearch, OpenSearch, and Typesense
> aren't traditional databases, but they're essential in modern stacks.
>
> They use inverted indexes to deliver full-text search, autocomplete,
> and relevance-ranked results in near-real-time.
>
> You'll find them powering product search, log aggregation,
> monitoring dashboards, and geospatial queries."

---

### 7. TIME-SERIES DATABASE (93s – 108s | Frames 2790–3240)
> "Time-series databases are optimized specifically for timestamped data.
> InfluxDB, TimescaleDB, and Prometheus are the big names here.
>
> They handle high-frequency ingestion, automatic downsampling,
> and retention policies out of the box.
>
> If you're tracking server metrics, financial tick data,
> or IoT sensor readings — a time-series database
> will outperform a general-purpose one by orders of magnitude."

---

### 8. VECTOR DATABASE (108s – 120s | Frames 3240–3600)
> "The newest category — vector databases. Pinecone, Weaviate, 
> pgvector, and Milvus store high-dimensional embeddings.
>
> They power semantic search, RAG pipelines for LLMs,
> image and audio similarity search, and recommendation engines.
>
> As AI applications explode, vector databases have become
> the critical link between your language model and your data."

---

### SUMMARY & DECISION GUIDE (120s – 140s | Frames 3600–4200)
> "So how do you choose? Here's a quick decision guide:
>
> Need ACID transactions? Go relational.
> Flexible schemas? Document stores.
> Sub-millisecond latency? Key-value.
> Massive write throughput? Wide-column.
> Deep relationships? Graph database.
> Full-text search? A search engine.
> Metrics and time data? Time-series.
> AI and embeddings? Vector database."

---

### CLOSING (140s – 150s | Frames 4200–4500)
> "In practice, most real-world systems use polyglot persistence — 
> combining multiple database types, each playing to its strength.
> The key is matching the right tool to the right problem."

---

## Timing Reference Table

| Section            | Start Frame | End Frame | Start Time | End Time |
|--------------------|-------------|-----------|------------|----------|
| Intro              | 0           | 90        | 0:00       | 0:03     |
| Relational (SQL)   | 90          | 540       | 0:03       | 0:18     |
| Document Store     | 540         | 990       | 0:18       | 0:33     |
| Key-Value Store    | 990         | 1440      | 0:33       | 0:48     |
| Wide-Column        | 1440        | 1890      | 0:48       | 1:03     |
| Graph Database     | 1890        | 2340      | 1:03       | 1:18     |
| Search Engine      | 2340        | 2790      | 1:18       | 1:33     |
| Time-Series        | 2790        | 3240      | 1:33       | 1:48     |
| Vector Database    | 3240        | 3600      | 1:48       | 2:00     |
| Summary/Guide      | 3600        | 4200      | 2:00       | 2:20     |
| Closing            | 4200        | 4500      | 2:20       | 2:30     |
