---
title: Network Protocols and the OSI Model
slug: network-protocols
date: 2024-05-28
author: Ashish Kumar
tags: [networking, protocols, osi-model, ports]
description: A quick reference guide covering common network protocols, the OSI layers they operate at, networking devices, and well-known port numbers.
---

There are various network protocols and they work at different layers of the OSI model. The diagram below gives a quick reference of protocols and the layers at which they work. There are more than these protocols but we have just mentioned the common ones.

Advice is to have an understanding of these protocols.

![Network protocols mapped to OSI model layers](/images/blog/network-layers.png)


### Networking Devices


Hub | Multiport repeater, Half Duplex, No intelligence, connect Devices together
-- | --
Switch | Forward traffic to right destination
Router | Route Tables, forwarding based on IP Table , connected multiple type of networks
Access Point | Wireless router or WAP , Bridge to connect, wired or wireless
DSL |  
Repeater | Regenerates signals
FireWall | Filters traffic , routers or dedicated hardware
Bridge |  
Patch Panels |  
CloudBased network controller | Central way to
EOP ethernet over power lines |  
Power over ethernet |  
		


### Most Used common protocols 


Scenario | Protocol |   | Ports | Details
|-- | -- | -- | -- | --|
|Files | FTP |   | 20/21 | 
  | AFP |   | 548 |  
  | SMB | TCP | 445 |  
  |   |   |   |  
Emails | SMTP | 25 | 25 |  
  | POP3 |   | 110 |  
  | IMAP |   | 143 |  
  |   |   |   |  
Web | HTTPS |   | 443 |  
  | HTTP |   | 80 |  
  |   |   |   |  
Management | Telnet |   | 23 |  
  | SSH |   | 22 |  
  | SNMP | TCP/UDP | 161/162 |  
  | RDP |   | 3389 |  
  |   |   |   |  
DNS |   |   | 53 |  
DHCP |   |   | 67/68 |  
SLP(Service Location Protocol) |   |   | 427 |  
NetBios |   | TCP/UDP | 137/138/139 |  
LDAP( Lightweight Directory Access Protocol) |   | TCP/UDP | 389 |  
Network time Protocol |   |   |   |  
ARP( Address Resolution Protocol) |   |   |   |  
