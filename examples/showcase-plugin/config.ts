interface ShowcasePluginConfig {
  readonly enabled: boolean;
  readonly scripts: { readonly showcase: { readonly enabled: boolean; readonly intervalMilliseconds: number } };
}

const showcasePluginConfig = { enabled: false, scripts: { showcase: { enabled: false, intervalMilliseconds: 60 * 60 * 1_000 } } } as const satisfies ShowcasePluginConfig;

export type { ShowcasePluginConfig };
export default showcasePluginConfig;
