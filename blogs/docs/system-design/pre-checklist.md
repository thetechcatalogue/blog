
---
sidebar_position: 2
---


### Basic Stationery Box 

Design interviews mostly talk about choice the right solution for the problem in hand, but most of solutions are picked up from a box of several choices. 
In-order for someone to choose from a box, somene must put something in the box , and this is where the box of tools comes into picture. 

Mostly in interviews a few things are common amongst which you need to make a choice. 


- Services
- Databases
- Networks 
- Caches 
- Languages 
- Protocols
- Security Options
- Operating Systems 
- Memory Managements 
- Data Structures
- Messaging 
- Algorithms 
- integration patterns

etc. 

These can be considered as subsection in your tool-box and you will see you have a pool of choices within each sub-section and you need to make a choice , and in order to do that you need to understand the basic requirement of the problem and then basic capability of that tool , for example to make a hole in a wall you will not take out a pin-hole bit.


### CAP 
Always Remember Cap theorem: Choose between availability and scalability




Most of the questions will be targeted towards understanding the data ingestion pipelines, and that involve focusing on below issues 

- How various requests to service will be coming ( single/buffered/batch)
- How will timeouts be considered depending on type of requests
- What will API look like 
- How does client – implement a re-try mechanism
- Where data is getting stored temporary
- How do you deal with duplicates 
- How do you scale a single service
- How the increase in database though through
- Which type of database is required. 
- How the incoming requests will be processed and stored. 
- Fault handling and tolerance of the system 
- Error Handling 
- What happens when something goes wrong , bottle necks etc.


Concepts while implementing a client 

1) Blocking vs Non-blocking calls (threads/ asyncs )
2) Buffering/ batching ? ( example logger client) 
3) timeouts (request timeouts 1% of slowest requests times)
4) retries  ( retry storm events , overload server with too many request )
5) exponential backoff and jitter algorithms
6) circuit breaker



Below diagram talks a 1 key info you should know about you tools inside the tool box

```mermaid
graph TD;
  subgraph System Design
    A[System] --> B[Key Considerations];
    B --> C[Key Technologies to Remember];
  end
  subgraph Algorithms
    D[Algorithm] --> E[Data Structures];
    E --> F[Complexity Analysis];
  end
  subgraph Data Structures
    G[Data Structure] --> H[Key Operations];
    H --> I[Time Complexity];
  end
  subgraph Networks
    J[Network] --> K[Key Concepts];
    K --> L[Protocols];
  end
  subgraph Operating Systems
    M[Operating System] --> N[Key Concepts];
    N --> O[Processes];
  end
  subgraph Databases
    P[Database] --> Q[Key Concepts];
    Q --> R[SQL vs NoSQL , Read and Write Throughput];
  end
  subgraph Caches
    S[Cache] --> T[Key Concepts];
    T --> U[Eviction Policies , Scale , Sharding];
  end
  subgraph Languages
    V[Language] --> W[Key Concepts];
    W --> X[Syntax];
  end

  subgraph Linux Kernels
    AB[Linux Kernel] --> AC[Key Concepts];
    AC --> AD[Process Management];
  end
  ```