# Data Modeling: A short guide with examples

## Table of Contents
1. [Introduction to Data Modeling](#introduction-to-data-modeling)
2. [Types of Data Models](#types-of-data-models)
3. [Entity Modeling](#entity-modeling)
4. [Relationship Modeling](#relationship-modeling)
5. [Database Modeling](#database-modeling)
6. [Dimensional Modeling](#dimensional-modeling)
7. [Object-Oriented Data Modeling](#object-oriented-data-modeling)
8. [NoSQL Data Modeling](#nosql-data-modeling)
9. [Graph Data Modeling](#graph-data-modeling)
10. [Time-Series Data Modeling](#time-series-data-modeling)
11. [Event-Driven Data Modeling](#event-driven-data-modeling)
12. [Data Modeling Methodologies](#data-modeling-methodologies)
13. [Best Practices and Design Patterns](#best-practices-and-design-patterns)
14. [Tools and Technologies](#tools-and-technologies)

## Introduction to Data Modeling

Data modeling is the process of creating a conceptual representation of data objects, their relationships, and the rules that govern them. It serves as a blueprint for database design and helps ensure data integrity, consistency, and efficient access patterns.

### Why Data Modeling Matters

- **Communication**: Provides a common language between business and technical teams
- **Documentation**: Serves as living documentation of data structures
- **Quality**: Ensures data consistency and integrity
- **Performance**: Optimizes data access patterns and query performance
- **Maintenance**: Simplifies future modifications and enhancements

### Data Modeling Levels

```
Conceptual Model (What) → Logical Model (How) → Physical Model (Where)
     ↓                        ↓                      ↓
Business View            Technical View        Implementation View
```

## Types of Data Models

### Overview of Data Modeling Approaches

| Model Type | Primary Focus | Use Cases | Key Characteristics |
|------------|---------------|-----------|-------------------|
| **Entity Modeling** | Business objects | Requirements gathering | High-level, business-focused |
| **Relationship Modeling** | Object connections | Process design | Focus on interactions |
| **Database Modeling** | Storage structure | Implementation | Technical, performance-oriented |
| **Dimensional Modeling** | Analytics | Data warehousing | Star/snowflake schemas |
| **Object-Oriented** | Code alignment | OOP applications | Inheritance, encapsulation |
| **NoSQL Modeling** | Flexible schemas | Modern applications | Document, key-value, column |
| **Graph Modeling** | Network relationships | Social networks, fraud | Nodes and edges |
| **Time-Series** | Temporal data | IoT, monitoring | Time-indexed data |
| **Event-Driven** | State changes | Event sourcing | Immutable events |

## Entity Modeling

### Definition and Purpose

Entity modeling focuses on identifying and defining the core business objects (entities) that an organization needs to track. It's the foundation of conceptual data modeling.

### Key Components

#### 1. Entity Definition
```
Entity: A thing of significance to the business about which data must be stored
Examples: Customer, Product, Order, Employee, Account
```

#### 2. Entity Characteristics
- **Tangible vs Intangible**: Physical objects vs concepts
- **Independent vs Dependent**: Can exist alone vs requires parent entity
- **Strong vs Weak**: Has its own identifier vs borrows identifier

### Entity Modeling Process

#### Step 1: Entity Identification
```markdown
Business Requirements Analysis:
1. Review business processes
2. Identify nouns in requirements
3. Determine what needs to be tracked
4. Validate with stakeholders

Example: E-commerce System
- Customer (who buys)
- Product (what is sold)
- Order (purchase transaction)
- Category (product grouping)
- Supplier (product source)
```

#### Step 2: Entity Classification
```markdown
Classification Framework:

Core Entities (Business Critical):
├── Customer
├── Product  
└── Order

Supporting Entities (Operational):
├── Category
├── Supplier
└── Address

Reference Entities (Master Data):
├── Country
├── Currency
└── Status
```

#### Step 3: Entity Attributes Definition
```markdown
Entity: Customer
├── Identifying Attributes
│   └── CustomerID (Primary Key)
├── Descriptive Attributes
│   ├── FirstName
│   ├── LastName
│   ├── Email
│   └── PhoneNumber
└── Administrative Attributes
    ├── CreatedDate
    ├── LastModified
    └── IsActive
```

### Entity Modeling Example: Library System

```markdown
Library Management System Entities:

1. BOOK
   - BookID (PK)
   - ISBN
   - Title
   - Author
   - Publisher
   - PublicationYear
   - Genre
   - Available

2. MEMBER
   - MemberID (PK)
   - FirstName
   - LastName
   - Email
   - PhoneNumber
   - Address
   - MembershipType
   - JoinDate

3. LOAN
   - LoanID (PK)
   - BookID (FK)
   - MemberID (FK)
   - LoanDate
   - DueDate
   - ReturnDate
   - Status

4. AUTHOR
   - AuthorID (PK)
   - FirstName
   - LastName
   - Biography
   - Nationality

5. RESERVATION
   - ReservationID (PK)
   - BookID (FK)
   - MemberID (FK)
   - ReservationDate
   - ExpiryDate
   - Status
```

## Relationship Modeling

### Definition and Scope

Relationship modeling focuses on defining how entities interact with each other, capturing the business rules that govern these interactions.

### Relationship Types

#### 1. Cardinality Classifications
```markdown
One-to-One (1:1):
├── Person ←→ Passport
├── Employee ←→ Desk Assignment
└── Country ←→ Capital City

One-to-Many (1:M):
├── Customer → Orders
├── Department → Employees
└── Category → Products

Many-to-Many (M:M):
├── Students ←→ Courses
├── Books ←→ Authors
└── Employees ←→ Projects
```

#### 2. Participation Constraints
```markdown
Mandatory vs Optional:

Mandatory (Total Participation):
- Every Order MUST have a Customer
- Every Employee MUST belong to a Department

Optional (Partial Participation):
- A Customer MAY have Orders
- An Employee MAY have a Manager
```

### Advanced Relationship Concepts

#### 1. Recursive Relationships
```markdown
Employee Management Hierarchy:
Employee ──manages──→ Employee

Examples:
- Manager manages Employees
- Category has Parent Category
- Product has Related Products
```

#### 2. Ternary Relationships
```markdown
Three-way relationship:
Supplier ──supplies──→ Product ──to──→ Project

Business Rule:
"A supplier supplies specific products to specific projects"
```

#### 3. Identifying vs Non-Identifying Relationships
```markdown
Identifying Relationship:
Customer ──has──→ Order
(Order cannot exist without Customer)

Non-Identifying Relationship:
Order ──assigned_to──→ Salesperson
(Order exists independently of Salesperson assignment)
```

### Relationship Modeling Example: Social Media Platform

```markdown
Social Media Relationships:

1. USER follows USER (M:M, Recursive)
   - FollowerID
   - FollowingID
   - FollowDate
   - NotificationEnabled

2. USER creates POST (1:M)
   - UserID
   - PostID
   - CreationDate

3. USER likes POST (M:M)
   - UserID
   - PostID
   - LikeDate
   - LikeType (like, love, laugh, etc.)

4. POST belongs_to GROUP (M:1)
   - PostID
   - GroupID
   - PostDate

5. USER joins GROUP (M:M)
   - UserID
   - GroupID
   - JoinDate
   - Role (member, admin, moderator)
```

## Database Modeling

### Definition and Focus

Database modeling translates conceptual and logical models into physical database structures, focusing on implementation details, performance optimization, and storage efficiency.

### Database Model Types

#### 1. Relational Database Modeling

**Characteristics:**
- Tables with rows and columns
- Primary and foreign key relationships
- ACID properties
- SQL-based querying

**Design Process:**
```markdown
Normalization Process:
1NF → 2NF → 3NF → BCNF
├── Eliminate repeating groups
├── Remove partial dependencies
├── Remove transitive dependencies
└── Remove remaining anomalies
```

**Example: E-commerce Relational Model**
```sql
-- Customers Table
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (Email)
);

-- Products Table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(200) NOT NULL,
    CategoryID INT,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT DEFAULT 0,
    Description TEXT,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    INDEX idx_category (CategoryID),
    INDEX idx_active (IsActive)
);

-- Orders Table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(12,2) NOT NULL,
    OrderStatus ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    INDEX idx_customer (CustomerID),
    INDEX idx_date (OrderDate),
    INDEX idx_status (OrderStatus)
);

-- Order Items Junction Table
CREATE TABLE OrderItems (
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (OrderID, ProductID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
```

#### 2. Denormalization for Performance
```sql
-- Denormalized Customer Order Summary
CREATE TABLE CustomerOrderSummary (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    TotalOrders INT DEFAULT 0,
    TotalSpent DECIMAL(12,2) DEFAULT 0.00,
    LastOrderDate TIMESTAMP,
    AverageOrderValue DECIMAL(10,2),
    PreferredCategory VARCHAR(50),
    -- Denormalized for reporting performance
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
```

### Physical Design Considerations

#### 1. Indexing Strategy
```sql
-- Performance Indexes
CREATE INDEX idx_orders_customer_date ON Orders(CustomerID, OrderDate);
CREATE INDEX idx_products_category_price ON Products(CategoryID, Price);
CREATE INDEX idx_customers_email_active ON Customers(Email, IsActive);

-- Composite Index for Common Query Patterns
CREATE INDEX idx_order_items_product_order ON OrderItems(ProductID, OrderID);
```

#### 2. Partitioning
```sql
-- Range Partitioning by Date
CREATE TABLE Orders (
    OrderID INT,
    CustomerID INT,
    OrderDate DATE,
    ...
) PARTITION BY RANGE (YEAR(OrderDate)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION pFuture VALUES LESS THAN MAXVALUE
);
```

## Dimensional Modeling

### Definition and Purpose

Dimensional modeling is designed specifically for analytical workloads and data warehousing, optimizing for query performance and business intelligence.

### Core Concepts

#### 1. Star Schema
```markdown
Fact Table (Center):
├── Sales Fact
│   ├── SalesID (PK)
│   ├── ProductKey (FK)
│   ├── CustomerKey (FK)
│   ├── DateKey (FK)
│   ├── StoreKey (FK)
│   ├── Quantity
│   ├── Revenue
│   └── Profit

Dimension Tables (Points):
├── Product Dimension
├── Customer Dimension  
├── Date Dimension
└── Store Dimension
```

#### 2. Snowflake Schema
```markdown
Normalized Dimensions:
Product Dimension:
├── Product
│   ├── ProductKey
│   ├── ProductName
│   └── CategoryKey (FK)
└── Category
    ├── CategoryKey
    ├── CategoryName
    └── DepartmentKey (FK)
    └── Department
        ├── DepartmentKey
        └── DepartmentName
```

### Dimensional Modeling Example: Retail Analytics

```sql
-- Date Dimension (Type 0 - Never Changes)
CREATE TABLE DimDate (
    DateKey INT PRIMARY KEY,
    FullDate DATE,
    DayOfWeek INT,
    DayName VARCHAR(10),
    Month INT,
    MonthName VARCHAR(10),
    Quarter INT,
    Year INT,
    IsWeekend BOOLEAN,
    IsHoliday BOOLEAN
);

-- Product Dimension (Type 2 - Track History)
CREATE TABLE DimProduct (
    ProductKey INT PRIMARY KEY,
    ProductID INT,  -- Business Key
    ProductName VARCHAR(200),
    Category VARCHAR(100),
    Brand VARCHAR(100),
    Price DECIMAL(10,2),
    EffectiveDate DATE,
    ExpiryDate DATE,
    IsCurrent BOOLEAN
);

-- Customer Dimension (Type 1 - Overwrite)
CREATE TABLE DimCustomer (
    CustomerKey INT PRIMARY KEY,
    CustomerID INT,  -- Business Key
    CustomerName VARCHAR(100),
    CustomerSegment VARCHAR(50),
    City VARCHAR(100),
    State VARCHAR(50),
    Country VARCHAR(50)
);

-- Sales Fact Table
CREATE TABLE FactSales (
    SalesKey INT PRIMARY KEY,
    ProductKey INT,
    CustomerKey INT,
    DateKey INT,
    Quantity INT,
    UnitPrice DECIMAL(10,2),
    Revenue DECIMAL(12,2),
    Cost DECIMAL(12,2),
    Profit DECIMAL(12,2),
    FOREIGN KEY (ProductKey) REFERENCES DimProduct(ProductKey),
    FOREIGN KEY (CustomerKey) REFERENCES DimCustomer(CustomerKey),
    FOREIGN KEY (DateKey) REFERENCES DimDate(DateKey)
);
```

### Slowly Changing Dimensions (SCD)

#### Type 1: Overwrite (No History)
```sql
-- Update customer address - lose history
UPDATE DimCustomer 
SET Address = 'New Address', City = 'New City'
WHERE CustomerID = 12345;
```

#### Type 2: Add New Record (Keep History)
```sql
-- End current record
UPDATE DimProduct 
SET ExpiryDate = '2024-01-31', IsCurrent = FALSE
WHERE ProductID = 456 AND IsCurrent = TRUE;

-- Insert new record with changes
INSERT INTO DimProduct (ProductID, ProductName, Price, EffectiveDate, IsCurrent)
VALUES (456, 'Updated Product Name', 29.99, '2024-02-01', TRUE);
```

#### Type 3: Add New Column (Limited History)
```sql
ALTER TABLE DimCustomer 
ADD COLUMN PreviousSegment VARCHAR(50),
ADD COLUMN SegmentChangeDate DATE;

UPDATE DimCustomer 
SET PreviousSegment = CustomerSegment,
    CustomerSegment = 'Premium',
    SegmentChangeDate = CURRENT_DATE
WHERE CustomerID = 789;
```

## Object-Oriented Data Modeling

### Definition and Characteristics

Object-oriented data modeling aligns data structures with object-oriented programming paradigms, emphasizing encapsulation, inheritance, and polymorphism.

### Core OO Concepts in Data Modeling

#### 1. Inheritance Hierarchies
```markdown
Vehicle (Superclass)
├── Car (Subclass)
│   ├── Sedan
│   └── SUV
├── Motorcycle (Subclass)
└── Truck (Subclass)
    ├── PickupTruck
    └── DeliveryTruck
```

#### 2. Implementation Strategies

**Table Per Hierarchy (TPH):**
```sql
CREATE TABLE Vehicle (
    VehicleID INT PRIMARY KEY,
    VehicleType VARCHAR(20), -- Discriminator
    Brand VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    -- Car specific
    NumberOfDoors INT,
    -- Motorcycle specific  
    HasSidecar BOOLEAN,
    -- Truck specific
    LoadCapacity DECIMAL(10,2)
);
```

**Table Per Type (TPT):**
```sql
-- Base table
CREATE TABLE Vehicle (
    VehicleID INT PRIMARY KEY,
    Brand VARCHAR(50),
    Model VARCHAR(50),
    Year INT
);

-- Derived tables
CREATE TABLE Car (
    VehicleID INT PRIMARY KEY,
    NumberOfDoors INT,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID)
);

CREATE TABLE Motorcycle (
    VehicleID INT PRIMARY KEY,
    HasSidecar BOOLEAN,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID)
);
```

**Table Per Concrete Class (TPC):**
```sql
CREATE TABLE Car (
    CarID INT PRIMARY KEY,
    Brand VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    NumberOfDoors INT
);

CREATE TABLE Motorcycle (
    MotorcycleID INT PRIMARY KEY,
    Brand VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    HasSidecar BOOLEAN
);
```

### OO Modeling Example: Content Management System

```sql
-- Base Content Entity
CREATE TABLE Content (
    ContentID INT PRIMARY KEY,
    Title VARCHAR(200),
    Author VARCHAR(100),
    CreatedDate TIMESTAMP,
    ContentType VARCHAR(50), -- Discriminator
    Status ENUM('draft', 'published', 'archived')
);

-- Article (inherits from Content)
CREATE TABLE Article (
    ContentID INT PRIMARY KEY,
    Body TEXT,
    WordCount INT,
    ReadingTime INT,
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID)
);

-- Video (inherits from Content)  
CREATE TABLE Video (
    ContentID INT PRIMARY KEY,
    Duration INT, -- seconds
    Resolution VARCHAR(20),
    FileSize BIGINT,
    VideoURL VARCHAR(500),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID)
);

-- Podcast (inherits from Content)
CREATE TABLE Podcast (
    ContentID INT PRIMARY KEY,
    Duration INT, -- seconds
    EpisodeNumber INT,
    AudioURL VARCHAR(500),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID)
);

-- Content Tags (Many-to-Many)
CREATE TABLE ContentTags (
    ContentID INT,
    TagID INT,
    PRIMARY KEY (ContentID, TagID),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID),
    FOREIGN KEY (TagID) REFERENCES Tags(TagID)
);
```

## NoSQL Data Modeling

### Document-Based Modeling (MongoDB)

Document modeling focuses on flexible, schema-less data storage optimized for application data access patterns.

#### Design Principles:
1. **Embed Related Data** when accessed together
2. **Reference Large or Frequently Updated Data**
3. **Optimize for Application Queries**
4. **Consider Document Size Limits**

#### Example: E-commerce Product Catalog
```json
// Embedded Document Model
{
  "_id": "product_123",
  "name": "Wireless Headphones",
  "brand": "TechBrand",
  "price": 99.99,
  "category": {
    "id": "electronics",
    "name": "Electronics",
    "parent": "consumer_goods"
  },
  "specifications": {
    "battery_life": "20 hours",
    "connectivity": ["Bluetooth 5.0", "USB-C"],
    "weight": "250g"
  },
  "reviews": [
    {
      "user_id": "user_456",
      "username": "techreviewer",
      "rating": 4,
      "comment": "Great sound quality!",
      "date": "2024-01-15"
    }
  ],
  "inventory": {
    "stock_count": 150,
    "warehouse_locations": ["WH01", "WH03"],
    "reorder_level": 20
  },
  "created_date": "2024-01-01T00:00:00Z",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

#### Reference Pattern for Large Collections:
```json
// Product Document (without embedded reviews)
{
  "_id": "product_123",
  "name": "Wireless Headphones",
  "brand": "TechBrand",
  "price": 99.99,
  "review_count": 1250,
  "average_rating": 4.2
}

// Separate Reviews Collection
{
  "_id": "review_789",
  "product_id": "product_123",
  "user_id": "user_456",
  "rating": 4,
  "comment": "Great sound quality!",
  "helpful_votes": 15,
  "date": "2024-01-15"
}
```

### Key-Value Modeling (Redis)

Key-value modeling focuses on simple, fast data retrieval using unique keys.

#### Design Patterns:

**1. Simple Key-Value Storage:**
```redis
# User session storage
SET user:session:abc123 "{"user_id": 456, "login_time": "2024-01-15T10:00:00Z"}"
EXPIRE user:session:abc123 3600

# Product cache
SET product:123 "{"name": "Headphones", "price": 99.99}"
```

**2. Hash Storage:**
```redis
# User profile
HSET user:456 name "John Doe"
HSET user:456 email "john@example.com"  
HSET user:456 last_login "2024-01-15"

# Product details
HSET product:123 name "Headphones"
HSET product:123 price "99.99"
HSET product:123 stock "150"
```

**3. List Storage:**
```redis
# User activity feed
LPUSH user:456:activities "liked_product:123"
LPUSH user:456:activities "viewed_product:789"
LTRIM user:456:activities 0 99  # Keep last 100 activities
```

**4. Set Storage:**
```redis
# User's favorite products
SADD user:456:favorites product:123
SADD user:456:favorites product:456
SADD user:456:favorites product:789

# Product tags
SADD product:123:tags "electronics"
SADD product:123:tags "audio"
SADD product:123:tags "wireless"
```

### Column-Family Modeling (Cassandra)

Column-family modeling optimizes for high-volume, distributed data storage with focus on query patterns.

#### Design Example: Time-Series Sensor Data
```cql
-- Sensor readings table
CREATE TABLE sensor_readings (
    sensor_id UUID,
    reading_date DATE,
    timestamp TIMESTAMP,
    temperature DECIMAL,
    humidity DECIMAL,
    pressure DECIMAL,
    PRIMARY KEY ((sensor_id, reading_date), timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);

-- User activity tracking  
CREATE TABLE user_activity (
    user_id UUID,
    activity_date DATE,
    timestamp TIMESTAMP,
    activity_type TEXT,
    activity_data MAP<TEXT, TEXT>,
    PRIMARY KEY ((user_id, activity_date), timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);

-- Product catalog with denormalization
CREATE TABLE products_by_category (
    category_id UUID,
    product_id UUID,
    product_name TEXT,
    price DECIMAL,
    brand TEXT,
    rating DECIMAL,
    created_date TIMESTAMP,
    PRIMARY KEY (category_id, price, product_id)
) WITH CLUSTERING ORDER BY (price ASC);
```

## Graph Data Modeling

### Definition and Use Cases

Graph modeling represents data as nodes (entities) and edges (relationships), ideal for highly connected data and complex relationship queries.

### Graph Model Components

#### 1. Nodes (Vertices)
```markdown
Node Types:
├── Person
├── Company  
├── Product
├── Location
└── Event
```

#### 2. Relationships (Edges)
```markdown
Relationship Types:
├── WORKS_FOR (Person → Company)
├── FRIENDS_WITH (Person → Person)
├── LOCATED_IN (Company → Location)
├── PURCHASED (Person → Product)
└── SIMILAR_TO (Product → Product)
```

#### 3. Properties
```markdown
Node Properties:
Person: {name, age, email, created_date}
Product: {title, price, category, rating}

Edge Properties:
WORKS_FOR: {start_date, position, salary}
PURCHASED: {date, quantity, total_amount}
```

### Graph Modeling Example: Social Network (Neo4j)

```cypher
// Create Person nodes
CREATE (alice:Person {
  name: 'Alice Johnson',
  age: 30,
  email: 'alice@email.com',
  location: 'New York'
})

CREATE (bob:Person {
  name: 'Bob Smith', 
  age: 25,
  email: 'bob@email.com',
  location: 'San Francisco'
})

// Create Company node
CREATE (tech_corp:Company {
  name: 'TechCorp',
  industry: 'Technology',
  founded: 2010,
  location: 'San Francisco'
})

// Create relationships
CREATE (alice)-[:WORKS_FOR {
  position: 'Software Engineer',
  start_date: '2022-01-15',
  salary: 120000
}]->(tech_corp)

CREATE (alice)-[:FRIENDS_WITH {
  since: '2020-05-10',
  connection_strength: 0.8
}]->(bob)

// Create skill nodes and relationships
CREATE (python:Skill {name: 'Python', category: 'Programming'})
CREATE (alice)-[:HAS_SKILL {proficiency: 'Expert', years: 5}]->(python)

// Query examples
// Find Alice's colleagues
MATCH (alice:Person {name: 'Alice Johnson'})-[:WORKS_FOR]->(company)
      <-[:WORKS_FOR]-(colleague:Person)
RETURN colleague.name, colleague.email

// Find friends of friends
MATCH (alice:Person {name: 'Alice Johnson'})-[:FRIENDS_WITH]->(friend)
      -[:FRIENDS_WITH]->(friend_of_friend:Person)
WHERE friend_of_friend <> alice
RETURN friend_of_friend.name, friend.name as mutual_friend
```

### Advanced Graph Patterns

#### 1. Recommendation Engine Model
```cypher
// Product recommendation based on purchase patterns
MATCH (user:Person {name: 'Alice'})-[:PURCHASED]->(product:Product)
      <-[:PURCHASED]-(other_user:Person)-[:PURCHASED]->(recommended:Product)
WHERE NOT (user)-[:PURCHASED]->(recommended)
RETURN recommended.name, 
       COUNT(other_user) as recommendation_score
ORDER BY recommendation_score DESC
LIMIT 10
```

#### 2. Fraud Detection Model
```cypher
// Find suspicious patterns - multiple people using same device/location
MATCH (person1:Person)-[:USES_DEVICE]->(device:Device)
      <-[:USES_DEVICE]-(person2:Person)
WHERE person1 <> person2
WITH person1, person2, device, 
     COUNT(*) as shared_sessions
WHERE shared_sessions > 5
RETURN person1.name, person2.name, 
       device.id, shared_sessions
ORDER BY shared_sessions DESC
```

## Time-Series Data Modeling

### Definition and Characteristics

Time-series modeling focuses on data points indexed by time, optimized for temporal queries, aggregations, and trend analysis.

### Design Principles

1. **Time as Primary Index**: Optimize for time-based queries
2. **Immutable Data**: Most time-series data doesn't change
3. **High Volume**: Handle millions of data points
4. **Aggregation Friendly**: Support downsampling and rollups
5. **Retention Policies**: Automatic data lifecycle management

### Time-Series Schema Patterns

#### 1. Single Metric Per Row (InfluxDB Style)
```sql
-- IoT Sensor Measurements
CREATE TABLE sensor_measurements (
    time TIMESTAMP,
    sensor_id STRING,
    location STRING,
    measurement_type STRING, -- temperature, humidity, pressure
    value FLOAT,
    unit STRING,
    tags MAP<STRING, STRING>, -- Additional metadata
    PRIMARY KEY (time, sensor_id, measurement_type)
);

-- Sample Data
INSERT INTO sensor_measurements VALUES
('2024-01-15 10:00:00', 'sensor_001', 'warehouse_a', 'temperature', 23.5, 'celsius', {'floor': '1', 'zone': 'A'}),
('2024-01-15 10:00:00', 'sensor_001', 'warehouse_a', 'humidity', 65.2, 'percent', {'floor': '1', 'zone': 'A'}),
('2024-01-15 10:01:00', 'sensor_001', 'warehouse_a', 'temperature', 23.7, 'celsius', {'floor': '1', 'zone': 'A'});
```

#### 2. Multiple Metrics Per Row (Wide Table)
```sql
-- Application Performance Metrics
CREATE TABLE app_metrics (
    timestamp TIMESTAMP,
    server_id STRING,
    cpu_usage_percent FLOAT,
    memory_usage_mb FLOAT,
    disk_io_read_mb FLOAT,
    disk_io_write_mb FLOAT,
    network_in_mb FLOAT,
    network_out_mb FLOAT,
    active_connections INT,
    response_time_ms FLOAT,
    error_rate_percent FLOAT,
    PRIMARY KEY (timestamp, server_id)
);
```

#### 3. Event-Based Time Series
```sql
-- User Activity Events
CREATE TABLE user_events (
    event_time TIMESTAMP,
    user_id UUID,
    session_id STRING,
    event_type STRING, -- page_view, click, purchase, logout
    event_data JSON, -- Flexible event-specific data
    user_agent STRING,
    ip_address STRING,
    referrer STRING,
    PRIMARY KEY (event_time, user_id, session_id)
) PARTITION BY RANGE (event_time);
```

### Time-Series Optimization Strategies

#### 1. Partitioning by Time
```sql
-- Monthly partitions for large datasets
CREATE TABLE metrics_2024_01 PARTITION OF metrics
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE metrics_2024_02 PARTITION OF metrics  
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

#### 2. Downsampling and Rollups
```sql
-- Create aggregated tables for different time granularities
CREATE TABLE hourly_metrics AS
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    server_id,
    AVG(cpu_usage_percent) as avg_cpu,
    MAX(cpu_usage_percent) as max_cpu,
    AVG(memory_usage_mb) as avg_memory,
    COUNT(*) as data_points
FROM app_metrics
GROUP BY hour, server_id;

CREATE TABLE daily_metrics AS
SELECT 
    DATE_TRUNC('day', hour) as day,
    server_id,
    AVG(avg_cpu) as avg_cpu,
    MAX(max_cpu) as peak_cpu,
    AVG(avg_memory) as avg_memory
FROM hourly_metrics
GROUP BY day, server_id;
```

#### 3. Retention Policies
```sql
-- Automatic data lifecycle management
DELETE FROM app_metrics 
WHERE timestamp < NOW() - INTERVAL '90 days';

DELETE FROM hourly_metrics 
WHERE hour < NOW() - INTERVAL '1 year';

-- Keep daily aggregates for 5 years
DELETE FROM daily_metrics 
WHERE day < NOW() - INTERVAL '5 years';
```

## Event-Driven Data Modeling

### Definition and Purpose

Event-driven modeling captures state changes as immutable events, enabling event sourcing, audit trails, and eventual consistency patterns.

### Core Concepts

#### 1. Event Structure
```json
{
  "event_id": "evt_123456789",
  "event_type": "OrderPlaced",
  "aggregate_id": "order_987654",
  "aggregate_type": "Order",
  "event_version": 1,
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "user_456",
  "correlation_id": "session_abc123",
  "causation_id": "command_xyz789",
  "data": {
    "customer_id": "cust_123",
    "items": [
      {
        "product_id": "prod_456",
        "quantity": 2,
        "unit_price": 29.99
      }
    ],
    "total_amount": 59.98,
    "shipping_address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  },
  "metadata": {
    "source": "web_application",
    "user_agent": "Mozilla/5.0...",
    "ip_address": "192.168.1.1"
  }
}
```

#### 2. Event Store Schema
```sql
-- Event Store Table
CREATE TABLE event_store (
    event_id UUID PRIMARY KEY,
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_version INTEGER NOT NULL,
    event_data JSONB NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    correlation_id UUID,
    causation_id UUID,
    
    -- Ensure event ordering within aggregate
    UNIQUE(aggregate_id, event_version),
    
    -- Indexes for common query patterns
    INDEX idx_aggregate (aggregate_id, event_version),
    INDEX idx_event_type (event_type, timestamp),
    INDEX idx_correlation (correlation_id),
    INDEX idx_timestamp (timestamp)
);
```

### Event-Driven Modeling Examples

#### 1. E-commerce Order Lifecycle
```sql
-- Event Types for Order Aggregate
INSERT INTO event_store (event_id, aggregate_id, aggregate_type, event_type, event_version, event_data) VALUES

-- Order Placed
('evt_001', 'order_123', 'Order', 'OrderPlaced', 1, '{
  "customer_id": "cust_456", 
  "items": [{"product_id": "prod_789", "quantity": 2}],
  "total": 99.98
}'),

-- Payment Processed  
('evt_002', 'order_123', 'Order', 'PaymentProcessed', 2, '{
  "payment_method": "credit_card",
  "amount": 99.98,
  "transaction_id": "txn_abc123"
}'),

-- Order Shipped
('evt_003', 'order_123', 'Order', 'OrderShipped', 3, '{
  "tracking_number": "TRK123456789",
  "carrier": "UPS",
  "estimated_delivery": "2024-01-20"
}'),

-- Order Delivered
('evt_004', 'order_123', 'Order', 'OrderDelivered', 4, '{
  "delivered_at": "2024-01-19T14:30:00Z",
  "signature": "J.Smith"
}');
```

#### 2. Projection/Read Model Generation
```sql
-- Order Summary Projection
CREATE TABLE order_projections (
    order_id UUID PRIMARY KEY,
    customer_id UUID,
    order_status VARCHAR(50),
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    last_updated TIMESTAMP
);

-- Projection Update Function
CREATE OR REPLACE FUNCTION update_order_projection()
RETURNS TRIGGER AS $$
BEGIN
    CASE NEW.event_type
        WHEN 'OrderPlaced' THEN
            INSERT INTO order_projections (
                order_id, customer_id, order_status, 
                total_amount, created_at, last_updated
            ) VALUES (
                NEW.aggregate_id,
                (NEW.event_data->>'customer_id')::UUID,
                'placed',
                (NEW.event_data->>'total')::DECIMAL,
                NEW.timestamp,
                NEW.timestamp
            );
            
        WHEN 'PaymentProcessed' THEN
            UPDATE order_projections 
            SET order_status = 'paid', last_updated = NEW.timestamp
            WHERE order_id = NEW.aggregate_id;
            
        WHEN 'OrderShipped' THEN
            UPDATE order_projections 
            SET order_status = 'shipped', 
                shipped_at = NEW.timestamp,
                last_updated = NEW.timestamp
            WHERE order_id = NEW.aggregate_id;
            
        WHEN 'OrderDelivered' THEN
            UPDATE order_projections 
            SET order_status = 'delivered',
                delivered_at = (NEW.event_data->>'delivered_at')::TIMESTAMP,
                last_updated = NEW.timestamp
            WHERE order_id = NEW.aggregate_id;
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain projections
CREATE TRIGGER order_projection_trigger
    AFTER INSERT ON event_store
    FOR EACH ROW
    EXECUTE FUNCTION update_order_projection();
```

### Event Sourcing Benefits and Challenges

#### Benefits:
- **Complete Audit Trail**: Every state change is recorded
- **Time Travel**: Recreate state at any point in time  
- **Debugging**: Understand exactly what happened and when
- **Analytics**: Rich data for business intelligence
- **Flexibility**: Easy to create new projections

#### Challenges:
- **Complexity**: More complex than CRUD operations
- **Storage**: Events accumulate over time
- **Eventual Consistency**: Projections may be temporarily out of sync
- **Schema Evolution**: Handling event structure changes

## Data Modeling Methodologies

### 1. Top-Down Approach

**Process Flow:**
```markdown
Business Requirements → Conceptual Model → Logical Model → Physical Model

Characteristics:
├── Starts with business needs
├── Focuses on entities and relationships
├── Gradually adds technical details
└── Good for new systems
```

**Example: Library Management System**
```markdown
Step 1: Business Requirements
- Track books and members
- Manage loans and returns
- Handle reservations
- Generate reports

Step 2: Conceptual Model
- Entities: Book, Member, Loan, Reservation
- Relationships: Member borrows Book, Member reserves Book

Step 3: Logical Model  
- Add attributes, keys, constraints
- Define cardinalities and participation
- Normalize relationships

Step 4: Physical Model
- Choose database technology
- Define indexes and partitions
- Optimize for performance
```

### 2. Bottom-Up Approach

**Process Flow:**
```markdown
Existing Data → Normalize → Group Related Data → Create Logical Model

Characteristics:
├── Starts with existing data sources
├── Focuses on data analysis and normalization
├── Good for legacy system modernization
└── Data-driven rather than requirements-driven
```

### 3. Agile Data Modeling

**Iterative Process:**
```markdown
Initial Model → Implement → Get Feedback → Refine Model → Repeat

Characteristics:
├── Evolutionary design
├── Just enough modeling
├── Continuous refinement
├── Close collaboration with development team
└── Embrace change
```

**Agile Modeling Principles:**
- **Model with a Purpose**: Only model what's necessary
- **Multiple Models**: Use different models for different purposes  
- **Travel Light**: Keep models simple and maintainable
- **Content Over Representation**: Focus on meaning, not notation
- **Know Your Tools**: Use appropriate modeling tools
- **Adapt to Specific Needs**: No one-size-fits-all approach

### 4. Domain-Driven Design (DDD)

**Core Concepts:**
```markdown
Bounded Context → Aggregates → Entities → Value Objects

Domain Model Components:
├── Entities (Identity-based objects)
├── Value Objects (Attribute-based objects)
├── Aggregates (Consistency boundaries)
├── Domain Services (Domain logic not fitting entities)
└── Repositories (Data access abstraction)
```

**DDD Modeling Example:**
```markdown
E-commerce Bounded Contexts:

1. Order Management Context:
   ├── Order Aggregate
   │   ├── Order (Entity - Root)
   │   ├── OrderItem (Entity)
   │   └── Address (Value Object)
   └── Customer (Entity)

2. Inventory Context:
   ├── Product Aggregate
   │   ├── Product (Entity - Root)
   │   ├── ProductVariant (Entity)
   │   └── Price (Value Object)
   └── Category (Entity)

3. Payment Context:
   ├── Payment Aggregate
   │   ├── Payment (Entity - Root)
   │   ├── PaymentMethod (Value Object)
   │   └── Transaction (Entity)
```

## Best Practices and Design Patterns

### 1. Universal Design Principles

#### Data Quality Principles
```markdown
ACCURATE: Data should be correct and error-free
COMPLETE: All required data should be present
CONSISTENT: Data should be consistent across systems
TIMELY: Data should be available when needed
VALID: Data should conform to defined formats
UNIQUE: No unnecessary duplication
```

#### Naming Conventions
```sql
-- Table Naming
customers              -- Plural nouns
order_items           -- Underscore for compound names
customer_addresses    -- Clear relationship indication

-- Column Naming  
customer_id           -- Descriptive and consistent
first_name           -- Readable format
created_timestamp    -- Include data type hint
is_active           -- Boolean prefix
total_amount        -- Clear business meaning

-- Index Naming
idx_customers_email                    -- idx_table_columns
idx_orders_customer_id_created_date   -- Composite indexes
pk_customers                          -- Primary key
fk_orders_customer_id                 -- Foreign key
```

### 2. Performance Design Patterns

#### 1. Read Replica Pattern
```sql
-- Master Database (Write Operations)
CREATE TABLE orders_master (
    order_id UUID PRIMARY KEY,
    customer_id UUID,
    order_date TIMESTAMP,
    total_amount DECIMAL(10,2),
    status VARCHAR(20)
);

-- Read Replica Configuration
-- Automatically synchronized from master
-- Used for reporting and analytics queries
-- Reduces load on master database
```

#### 2. Materialized View Pattern
```sql
-- Complex aggregation query
CREATE MATERIALIZED VIEW customer_order_summary AS
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name;

-- Refresh strategy
REFRESH MATERIALIZED VIEW customer_order_summary;
```

#### 3. Sharding Pattern
```sql
-- Horizontal partitioning by customer region
CREATE TABLE orders_us (
    LIKE orders_template INCLUDING ALL,
    CONSTRAINT orders_us_region_check CHECK (region = 'US')
);

CREATE TABLE orders_eu (
    LIKE orders_template INCLUDING ALL,
    CONSTRAINT orders_eu_region_check CHECK (region = 'EU')
);

-- Application-level routing
-- Route US customers to orders_us
-- Route EU customers to orders_eu
```

### 3. Data Integrity Patterns

#### 1. Audit Trail Pattern
```sql
-- Audit table for tracking changes
CREATE TABLE customer_audit (
    audit_id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL,
    operation_type VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT NOW(),
    change_reason TEXT
);

-- Trigger function for automatic auditing
CREATE OR REPLACE FUNCTION audit_customer_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO customer_audit (customer_id, operation_type, old_values, changed_by)
        VALUES (OLD.customer_id, 'DELETE', row_to_json(OLD), USER);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO customer_audit (customer_id, operation_type, old_values, new_values, changed_by)
        VALUES (OLD.customer_id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), USER);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO customer_audit (customer_id, operation_type, new_values, changed_by)
        VALUES (NEW.customer_id, 'INSERT', row_to_json(NEW), USER);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

#### 2. Soft Delete Pattern
```sql
-- Add deletion tracking columns
ALTER TABLE customers 
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN deleted_at TIMESTAMP,
ADD COLUMN deleted_by UUID;

-- Soft delete function
UPDATE customers 
SET is_deleted = TRUE,
    deleted_at = NOW(),
    deleted_by = :user_id
WHERE customer_id = :customer_id;

-- Views for active records only
CREATE VIEW active_customers AS
SELECT * FROM customers 
WHERE is_deleted = FALSE OR is_deleted IS NULL;
```

#### 3. Optimistic Locking Pattern
```sql
-- Add version column for concurrency control
ALTER TABLE products
ADD COLUMN version INTEGER DEFAULT 1;

-- Update with version check
UPDATE products 
SET name = :new_name,
    price = :new_price,
    version = version + 1
WHERE product_id = :product_id 
  AND version = :expected_version;

-- Application should check affected rows
-- If 0 rows affected, another user modified the record
```

## Tools and Technologies

### Data Modeling Tools

#### 1. Enterprise Tools
```markdown
ERwin Data Modeler:
├── Comprehensive enterprise modeling
├── Forward/reverse engineering
├── Supports multiple databases
└── Team collaboration features

PowerDesigner:
├── Unified modeling (data, process, enterprise)
├── Model validation and impact analysis
├── Extensive database support
└── Integration with development tools

ER/Studio:
├── Data architecture and modeling
├── Data lineage and impact analysis
├── Collaborative modeling
└── Agile modeling support
```

#### 2. Open Source Tools
```markdown
MySQL Workbench:
├── Visual database design
├── SQL development
├── Database administration
└── Free with MySQL

pgAdmin/pgModeler:
├── PostgreSQL-focused
├── Visual schema design
├── SQL script generation
└── Open source

DbSchema:
├── Universal database designer
├── Visual query builder
├── Documentation generation
└── Multiple database support
```

#### 3. Cloud-Based Tools
```markdown
Lucidchart:
├── Web-based diagramming
├── Real-time collaboration
├── Template library
└── Integration with other tools

Draw.io (now Diagrams.net):
├── Free web-based tool
├── Extensive shape libraries
├── Export to multiple formats
└── No registration required

Vertabelo:
├── Online database modeler
├── Team collaboration
├── Version control
└── SQL script generation
```

### Database Technologies by Use Case

#### OLTP (Online Transaction Processing)
```markdown
PostgreSQL:
├── Advanced SQL features
├── JSON/JSONB support
├── Strong consistency
└── Extensible architecture

MySQL:
├── High performance
├── Wide adoption
├── Good tooling ecosystem
└── Cloud provider support

SQL Server:
├── Enterprise features
├── Integration with Microsoft stack
├── Advanced analytics
└── Hybrid cloud support
```

#### OLAP (Online Analytical Processing)
```markdown
Snowflake:
├── Cloud-native architecture
├── Separate compute and storage
├── Zero-copy cloning
└── Time travel features

Amazon Redshift:
├── Columnar storage
├── Massively parallel processing
├── AWS ecosystem integration
└── Cost-effective scaling

Google BigQuery:
├── Serverless architecture
├── Machine learning integration
├── Real-time analytics
└── Automatic scaling
```

#### NoSQL Databases
```markdown
Document Stores:
├── MongoDB (General purpose)
├── Amazon DocumentDB (AWS managed)
├── Azure Cosmos DB (Multi-model)
└── CouchDB (Offline-first)

Key-Value Stores:
├── Redis (In-memory, caching)
├── Amazon DynamoDB (Managed)
├── Apache Cassandra (Distributed)
└── Riak (Distributed, available)

Graph Databases:
├── Neo4j (Property graph)
├── Amazon Neptune (Multi-model)
├── ArangoDB (Multi-model)
└── OrientDB (Multi-model)
```

### Modern Data Stack Components

#### Data Integration
```markdown
ETL/ELT Tools:
├── Apache Airflow (Workflow orchestration)
├── dbt (Data transformation)
├── Fivetran (Managed ETL)
├── Stitch (Simple data integration)
└── Talend (Enterprise data integration)

Change Data Capture:
├── Debezium (Open source CDC)
├── AWS DMS (Database migration service)
├── Confluent Platform (Kafka-based)
└── Oracle GoldenGate (Enterprise CDC)
```

#### Data Quality and Governance
```markdown
Data Catalogs:
├── Apache Atlas (Open source)
├── AWS Glue Data Catalog
├── Google Cloud Data Catalog
├── Collibra (Enterprise)
└── Alation (Enterprise)

Data Quality Tools:
├── Great Expectations (Python-based)
├── Deequ (Scala/Spark-based)
├── Apache Griffin (Big data quality)
├── Talend Data Quality
└── Informatica Data Quality
```