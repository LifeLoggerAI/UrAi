<<<<<<< HEAD
'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
=======
// @ts-nocheck
'use client';

import * as React from 'react';
import {
  Tooltip as TooltipPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipTrigger,
} from 'recharts';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const ChartContext = React.createContext(null);

function ChartContainer({
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: any;
  children: React.ReactNode;
}) {
  const id = React.useId();
  const [activeChart, setActiveChart] = React.useState(null);

  const chartConfig = React.useMemo(() => {
    return {
      ...config,
    };
  }, [config]);

  return (
    <ChartContext.Provider value={{ chartConfig, activeChart, setActiveChart }}>
      <div
        data-chart={id}
        className={cn(
          "chart-container flex flex-col gap-2 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-polar-grid_[cx=50%][cy=50%]_line]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-radial-grid_line]:stroke-border",
>>>>>>> 5be23281 (Commit before pulling remote changes)
          className
        )}
        {...props}
      >
<<<<<<< HEAD
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
=======
        {children}
>>>>>>> 5be23281 (Commit before pulling remote changes)
      </div>
    </ChartContext.Provider>
  );
}
ChartContainer.displayName = 'Chart';

<<<<<<< HEAD
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: 'line' | 'dot' | 'dashed';
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn('font-medium', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn('font-medium', labelClassName)}>{value}</div>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';
=======
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

const ChartTooltip = TooltipPrimitive;

const ChartTooltipContent = React.forwardRef<
  any,
  React.ComponentProps<typeof TooltipContentPrimitive> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }
>(
  (
    {
      className,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = 'dot',
      nameKey = 'name',
      labelKey = 'label',
      ...props
    },
    ref
  ) => {
    const { chartConfig } = useChart();

    if (!payload || !payload.length) {
      return null;
    }

    const [item] = payload;
    const { color, name } = item;
>>>>>>> 5be23281 (Commit before pulling remote changes)

    return (
      <div
        ref={ref}
        className={cn(
<<<<<<< HEAD
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center'
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
=======
          'min-w-[8rem] grid items-stretch gap-1.5 rounded-lg border bg-background p-2.5 text-sm shadow-xl',
          className
        )}
        {...props}
      >
        {!hideLabel && (
          <div className="font-medium text-muted-foreground">
            {label || item.payload[labelKey] || 'Value'}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, i) => {
            const { name, value, color } = item;
            const config = chartConfig[name];

            return (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-1.5"
              >
                <div className="flex items-center gap-1.5">
                  {!hideIndicator && (
                    <span
                      className={cn('h-2.5 w-2.5 shrink-0 rounded-[2px]', {
                        'bg-dot': indicator === 'dot',
                        'bg-line': indicator === 'line',
                        'bg-dashed': indicator === 'dashed',
                      })}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  )}
                  <span className="flex-1 text-muted-foreground">
                    {config?.label || name}
                  </span>
                </div>
                <span className="font-mono font-medium text-foreground">
                  {value}
                </span>
>>>>>>> 5be23281 (Commit before pulling remote changes)
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
<<<<<<< HEAD
ChartTooltipContent.displayName = 'ChartTooltip';

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> &
    Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-4',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className
        )}
      >
        {payload.map(item => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegend';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}
=======
ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegendContext = React.createContext(null);

function ChartLegend({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { chartConfig } = useChart();

  if (!chartConfig) {
    return null;
  }

  return (
    <ChartLegendContext.Provider value={{ chartConfig }}>
      <div
        className={cn(
          'flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground',
          className
        )}
        {...props}
      />
    </ChartLegendContext.Provider>
  );
}
ChartLegend.displayName = 'ChartLegend';

const legendItemVariants = cva(
  'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-muted/80 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
  {
    variants: {
      inactive: {
        true: 'text-muted-foreground/70 opacity-70',
      },
    },
  }
);

function ChartLegendItem({
  className,
  name,
  ...props
}: React.ComponentProps<'div'> & { name: string }) {
  const { chartConfig, activeChart, setActiveChart } = React.useContext(ChartLegendContext);
  const isInactive = activeChart && activeChart !== name;
  const { color, label } = chartConfig[name];

  return (
    <div
      className={cn(legendItemVariants({ inactive: isInactive }), className)}
      onClick={() => {
        setActiveChart(isInactive ? null : name);
      }}
      onMouseEnter={() => {
        if (!isInactive) {
          setActiveChart(name);
        }
      }}
      onMouseLeave={() => {
        setActiveChart(null);
      }}
      {...props}
    >
      <div
        className="h-2 w-2 shrink-0 rounded-[2px]"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  );
}
ChartLegendItem.displayName = 'ChartLegendItem';
>>>>>>> 5be23281 (Commit before pulling remote changes)

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem as ChartLegendContent,
  useChart,
};
