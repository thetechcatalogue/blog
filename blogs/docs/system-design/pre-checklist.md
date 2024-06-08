
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