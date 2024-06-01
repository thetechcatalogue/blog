---
sidebar_position: 4
---

### Selecting Architecture

First step usually is to identify what kind of overall architecture might help us to achive most of the desired properties of the system. 

Most of the people interviewing are obsessed with Distributed Systems so much that, talking to them about having a monolith as first choice  is a no go! 
Although major systems and clouds are application monolith. Means although database is separate, but most of the application logic runs on a single deployed code. Obsession over knowning recent terminologies and patterns of intergration which have come up in trend recently are more asked interviews ( simply because less people knew them and it was kind of cool for interviewer to ask them ! )

A distributed architecture is the opposite — the application consists of multiple services running in their own ecosystem, communicating via networking protocols.
Distributed architectures may feature finer-grained deployment models, where each service may have its own release cadence and engineering practices, based on the development team and their priorities.

Here you must understand what monolithic architecure means and what distributed arch means.

Distributed (multiple deployment units connected through remote access protocols) [ref: https://learning.oreilly.com/library/view/fundamentals-of-software/9781492043447/ch09.xhtml#idm46005304152280]


But within these systems there are other specific patterns of achitecture which is work getting familiar with. 

**Monolithic**
- Layered architecture -> topology is of layered systems talking with interfaces

- Pipeline architecture -> 
Most developers know this architecture as this underlying principle behind Unix terminal shell languages, such as Bash and Zsh.
MapReduce programming model follow this basic topology.
Pipes and Filters are the basic building blocks of this. Example systems are Kafka, you can build a pipeline.
pipeline architecture is usually implemented as a monolithic deployment, the architectural quantum is always one.

- Microkernel architecture -> 
Visual studio Code is an excellent example of such system with such arch. 


**Distributed**
- Service-based architecture
Although service-based architecture is a distributed architecture, it doesn’t have the same level of complexity and cost as other distributed architectures, such as microservices or event-driven architecture, making it a very popular choice for many business-related applications.
[ref:https://learning.oreilly.com/library/view/fundamentals-of-software/9781492043447/ch13.xhtml]

- Event-driven architecture
The event-driven architecture style is a popular distributed asynchronous architecture style used to produce highly scalable and high-performance applications. It is also highly adaptable and can be used for small applications and as well as large, complex ones. Event-driven architecture is made up of decoupled event processing components that asynchronously receive and process events. It can be used as a standalone architecture style or embedded within other architecture styles.
There are two primary topologies within event-driven architecture: the mediator topology and the broker topology
The broker topology differs from the mediator topology in that there is no central event mediator. Rather, the message flow is distributed across the event processor components in a chain-like broadcasting fashion through a lightweight message broker (such as RabbitMQ, ActiveMQ, HornetQ, and so on). This topology is useful when you have a relatively simple event processing flow and you do not need central event orchestration and coordination.
The main issue with asynchronous communications is error handling. While responsiveness is significantly improved, it is difficult to address error conditions, adding to the complexity of the event-driven system. The next section addresses this issue with a pattern of reactive architecture called the workflow event pattern.

- Space-based architecture

- Service-oriented architecture

- Microservices architecture



Mix and Match : though the discussion does start with both parties claiming that they are designing a highly sophisticated , billion user scalable and 100 years realiable and 100% available microservice architecture. In reality most of the architectures are mix and match of above patterns. 

This is because today's prodcut and customer requirements are so diverse and demanding that no single defined architecure is capable of meeting all demands. For example for an e-commerce website it is common to have a mix of distributed service architecure of  Service - Oriented , Event Driven and Microservice Architecture and even each component may have a different implementation of these architecture based on requirements. We will see the most common use cases later as well where no 1 pattern is the right pattern. 

in the below table we are presenting a few well known architecures , To a user we suggest to readm more about them and make a choice as to which one should be picked up for solving the interview problem. 


**Few Architectural patterns**

Pattern | Description
-- | --
Layers Pattern | Separates a system into distinct layers to improve modularity and flexibility
Ports and Adapters Pattern | Separates an application into two primary components: the application itself and its interaction with the outside world
Pipe-and-Filter Pattern | Divides a system into a set of filters that transform the data flowing through a pipeline of interconnected components
Service-Oriented Architecture Pattern | Organizes an application into a collection of loosely coupled services that communicate with each other via a standardized interface
Publish-Subscribe Pattern | Decouples the sender of a message from the recipient by allowing multiple recipients to receive the same message
Shared-Data Pattern | Allows multiple components to access the same data source, improving efficiency and reducing redundancy
Multi-Tier Pattern | Separates an application into multiple tiers, with each tier performing a distinct function
Center of Competence Pattern | Establishes a central team with specialized expertise to support development across the organization
Open Source Contribution Pattern | Encourages and facilitates contributions to open source projects
Big Ball of Mud Pattern | Describes a system that lacks a clear architecture and is difficult to maintain and modify
Discover New Patterns | Encourages the exploration and development of new patterns for solving complex software design problems