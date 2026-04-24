---
marp: true
theme: default
paginate: true
header: "Tech Catalogue"
footer: "Network and Protocols"
---

<!-- notes: Welcome to this presentation on Network and Protocols. There are various network protocols that operate at different layers of the OSI model. This diagram gives a quick reference of protocols and the layers at which they work. While there are many more protocols, we've highlighted the most common ones. Having a solid understanding of these protocols is essential for any network professional. -->

# Network and Protocols


There are various network protocols and they works at different layers of OSI model. The digaram below gives a quick reference of protocols and layers at which they work. There are more than these protocols but we hae just mentioned the common ones. 

Advice is to have an understanding of these protocols. 

![network layers](./images/network-layers.png)



---

<!-- notes: Let's look at the key networking devices. A Hub is a basic multiport repeater that operates in half duplex mode with no intelligence — it simply broadcasts data to all connected devices. A Switch is smarter and forwards traffic only to the correct destination. Routers use route tables to forward packets based on IP addresses and can connect multiple types of networks. Access Points provide wireless connectivity. A Repeater regenerates signals to extend range. Firewalls filter traffic for security. Patch Panels organize cable connections, and cloud-based network controllers provide centralized network management. -->

### Networking Devices 


Hub | Multiport repeater, Half Duplex, No intelligence, connect Devices together
-- | --
Switch | Forward traffic to right destination
Router | Route Tables, forwarding based on IP Table , connected multiple type of networks
Access Point | Wireless router or WAP , Bridge to connect, wired or wireless
DSL |  
Repeater | Regenrates signals
FireWall | Filters traffic , routers or dedicated hardware
Bridge |  
Patch Panels |  
CloudBased network controller | Central way to
EOP ethernet over power lines |  
Power over ethernet |  
		



---

<!-- notes: Now let's review the most commonly used network protocols. For file transfers, FTP uses ports 20 and 21, AFP uses port 548, and SMB runs on TCP port 445. For email, SMTP sends mail on port 25, POP3 downloads mail on port 110, and IMAP syncs mail on port 143. For web traffic, HTTPS on port 443 is the secure standard, while HTTP uses port 80. For remote management, Telnet on port 23 is insecure, SSH on port 22 is the secure alternative, SNMP on ports 161 and 162 handles network monitoring, and RDP on port 3389 provides remote desktop access. Other important protocols include DNS on port 53 for name resolution, DHCP on ports 67 and 68 for automatic IP assignment, LDAP on port 389 for directory services, and ARP for resolving IP addresses to MAC addresses. -->

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
