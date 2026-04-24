---
marp: true
theme: default
paginate: true
header: "Tech Catalogue"
footer: "Network Protocols"
---

<!-- notes: Welcome to this presentation on Network and Protocols. We'll explore how various network protocols operate at different layers of the OSI model, covering networking devices, file transfer, email, web, and management protocols. -->

# Network and Protocols

Various network protocols work at different layers of the OSI model.

---

<!-- notes: Let's start with networking devices. A Hub is a simple multiport repeater that works in half duplex with no intelligence. A Switch is smarter — it forwards traffic only to the correct destination. Routers use route tables to forward packets based on IP addresses and can connect different types of networks. Access Points provide wireless connectivity, acting as a bridge between wired and wireless networks. Repeaters regenerate signals to extend network range, and Firewalls filter traffic to protect the network. -->

## Networking Devices

| Device | Description |
|--------|-------------|
| Hub | Multiport repeater, Half Duplex, No intelligence |
| Switch | Forward traffic to right destination |
| Router | Route Tables, forwarding based on IP Table |
| Access Point | Wireless router or WAP |
| Repeater | Regenerates signals |
| FireWall | Filters traffic |

---

<!-- notes: Now let's look at file transfer and email protocols. For file transfers, FTP uses ports 20 and 21, AFP uses port 548 for Apple file sharing, and SMB runs on TCP port 445 for Windows file sharing. For emails, SMTP on port 25 handles sending mail, POP3 on port 110 downloads mail to your device, and IMAP on port 143 keeps mail synchronized on the server so you can access it from multiple devices. -->

## Common Protocols — Files & Email

| Scenario | Protocol | Ports |
|----------|----------|-------|
| Files | FTP | 20/21 |
| | AFP | 548 |
| | SMB | 445 |
| Emails | SMTP | 25 |
| | POP3 | 110 |
| | IMAP | 143 |

---

<!-- notes: For web browsing, HTTPS on port 443 provides encrypted connections and should always be preferred over HTTP on port 80. For remote management, Telnet on port 23 is unencrypted and considered insecure. SSH on port 22 is the secure alternative for remote access. SNMP on ports 161 and 162 is used for network monitoring and management. And RDP on port 3389 provides remote desktop access to Windows machines. -->

## Common Protocols — Web & Management

| Scenario | Protocol | Ports |
|----------|----------|-------|
| Web | HTTPS | 443 |
| | HTTP | 80 |
| Management | Telnet | 23 |
| | SSH | 22 |
| | SNMP | 161/162 |
| | RDP | 3389 |

---

<!-- notes: Here are some other essential protocols. DNS on port 53 translates domain names to IP addresses — it's the phonebook of the internet. DHCP on ports 67 and 68 automatically assigns IP addresses to devices on a network. SLP, the Service Location Protocol on port 427, helps devices discover services on a local network. NetBIOS on ports 137 through 139 provides name resolution and session services for older Windows networking. And LDAP, the Lightweight Directory Access Protocol on port 389, is used for accessing directory services like Active Directory. -->

## Other Important Protocols

| Protocol | Ports |
|----------|-------|
| DNS | 53 |
| DHCP | 67/68 |
| SLP | 427 |
| NetBIOS | 137/138/139 |
| LDAP | 389 |

---

<!-- notes: Thank you for watching this presentation on network protocols. We covered networking devices, file transfer, email, web, management, and other essential protocols. Visit Tech Catalogue to learn more about networking and other technology topics. -->

# Thank You!

**Tech Catalogue** — Learn about networking and more.
