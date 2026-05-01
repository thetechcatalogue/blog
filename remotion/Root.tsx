import { Composition, staticFile } from "remotion";
import { MarkdownVideo } from "./MarkdownVideo";
import { parseMarkdownToScenes } from "./parseMarkdown";
import { ClientServerFlow } from "./diagrams/ClientServerFlow";
import { httpRequestFlow, apiAuthFlow } from "./diagrams/flows";
import { AgentArchitecture } from "./diagrams/AgentArchitecture";
import { DatabaseTypes } from "./diagrams/DatabaseTypes";
import { CodeMarkerPitch } from "./diagrams/CodeMarkerPitch";
import { DistributedSystemsMap } from "./diagrams/DistributedSystemsMap";

const designPatternsMarkdown = `# What Are Design Patterns?

Design patterns are reusable solutions to commonly occurring problems in software design.

## Why Use Them?

- They provide proven solutions to recurring problems
- They create a shared vocabulary among developers
- They make code more maintainable and flexible
- They help avoid reinventing the wheel

## The Observer Pattern

The Observer pattern defines a one-to-many dependency between objects. When one object changes state, all its dependents are notified automatically.

\`\`\`python
class EventEmitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def emit(self, event, *args):
        for cb in self._listeners.get(event, []):
            cb(*args)
\`\`\`

## Key Takeaways

- Patterns are tools, not rules
- Pick the right pattern for the problem
- Keep it simple — don't over-engineer
`;

const networkProtocolsMarkdown = `---
title: Network and Protocols
slug: network-protocols
description: A quick reference of network protocols and the OSI layers they operate at.
---

There are various network protocols and they work at different layers of OSI model.

### Networking Devices

Hub | Multiport repeater, Half Duplex, No intelligence
Switch | Forward traffic to right destination
Router | Route Tables, forwarding based on IP Table
Access Point | Wireless router or WAP, Bridge to connect wired or wireless
Repeater | Regenerates signals
FireWall | Filters traffic, routers or dedicated hardware

### Most Used Common Protocols

Scenario | Protocol | Ports | Details
Files | FTP | 20/21 | File Transfer Protocol
Files | SMB | 445 | Server Message Block
Emails | SMTP | 25 | Simple Mail Transfer
Emails | POP3 | 110 | Post Office Protocol
Emails | IMAP | 143 | Internet Message Access
Web | HTTPS | 443 | Secure HTTP
Web | HTTP | 80 | Hypertext Transfer
Management | SSH | 22 | Secure Shell
Management | RDP | 3389 | Remote Desktop
DNS | DNS | 53 | Domain Name System
DHCP | DHCP | 67/68 | Dynamic Host Config
`;

const designScenes = parseMarkdownToScenes(designPatternsMarkdown);
const designTotalFrames = designScenes.reduce((sum, s) => sum + s.duration, 0);

const networkScenes = parseMarkdownToScenes(networkProtocolsMarkdown);
const networkTotalFrames = networkScenes.reduce((sum, s) => sum + s.duration, 0);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DesignPatterns"
        component={MarkdownVideo}
        durationInFrames={designTotalFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: designScenes }}
      />
      <Composition
        id="NetworkProtocols"
        component={MarkdownVideo}
        durationInFrames={networkTotalFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: networkScenes }}
      />
      <Composition
        id="HttpRequestFlow"
        component={ClientServerFlow}
        durationInFrames={60 + httpRequestFlow.steps.length * 60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ config: httpRequestFlow }}
      />
      <Composition
        id="ApiAuthFlow"
        component={ClientServerFlow}
        durationInFrames={60 + apiAuthFlow.steps.length * 60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ config: apiAuthFlow }}
      />
      <Composition
        id="AgentArchitecture"
        component={AgentArchitecture}
        durationInFrames={3399}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          narrationSrc: staticFile("agent-narration.mp3"),
          bgmSrc: undefined,
        }}
      />
      <Composition
        id="DatabaseTypes"
        component={DatabaseTypes}
        durationInFrames={8901}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          narrationSrc: staticFile("databasetypes.mp3"),
          bgmSrc: undefined,
        }}
      />
      <Composition
        id="CodeMarkerPitch"
        component={CodeMarkerPitch}
        durationInFrames={6308}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          narrationSrc: staticFile("codemarker.mp3"),
          bgmSrc: undefined,
        }}
      />
      <Composition
        id="DistributedSystemsMap"
        component={DistributedSystemsMap}
        durationInFrames={1320}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
