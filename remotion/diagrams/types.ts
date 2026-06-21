export interface FlowStep {
  from: "client" | "server" | "db" | "cache" | "cdn" | "lb";
  to: "client" | "server" | "db" | "cache" | "cdn" | "lb";
  label: string;
  sublabel?: string;
  color?: string;
  /**
   * Optional: frame offset at which this step should appear (overrides default timing)
   */
  appearAt?: number;
}

export interface FlowConfig {
  title: string;
  subtitle?: string;
  actors: Array<{
    id: "client" | "server" | "db" | "cache" | "cdn" | "lb";
    entityId?: string;
    label: string;
    icon: string;
    color: string;
  }>;
  steps: FlowStep[];
}
