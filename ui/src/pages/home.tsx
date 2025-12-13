import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Key,
  Zap,
  Users,
  Stethoscope,
  AlertTriangle,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Cpu,
  Database,
  Settings,
  Terminal,
  Sparkles,
  Circle,
} from 'lucide-react';
import { CcsLogo } from '@/components/ccs-logo';
import { useOverview } from '@/hooks/use-overview';
import { useSharedSummary } from '@/hooks/use-shared';
import { useHealth } from '@/hooks/use-health';
import { useCliproxyAuth } from '@/hooks/use-cliproxy';
import { cn } from '@/lib/utils';

// Live clock component
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-4xl font-bold tracking-tight tabular-nums">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </div>
  );
}

// Provider status configuration
const PROVIDERS = [
  { id: 'gemini', name: 'Gemini', icon: '◆', color: 'bg-blue-500' },
  { id: 'codex', name: 'Codex', icon: '⬡', color: 'bg-green-500' },
  { id: 'agy', name: 'Antigravity', icon: '◇', color: 'bg-purple-500' },
] as const;

// Quick launch shortcuts - icon based
const QUICK_LAUNCH = [
  {
    key: 'G',
    label: 'Gemini',
    command: 'ccs gemini',
    color: 'hover:bg-blue-500/20 hover:border-blue-500/50',
  },
  {
    key: 'C',
    label: 'Codex',
    command: 'ccs codex',
    color: 'hover:bg-green-500/20 hover:border-green-500/50',
  },
  {
    key: 'A',
    label: 'Agy',
    command: 'ccs agy',
    color: 'hover:bg-purple-500/20 hover:border-purple-500/50',
  },
  {
    key: 'K',
    label: 'Kimi',
    command: 'ccs kimi',
    color: 'hover:bg-amber-500/20 hover:border-amber-500/50',
  },
  {
    key: 'L',
    label: 'GLM',
    command: 'ccs glm',
    color: 'hover:bg-orange-500/20 hover:border-orange-500/50',
  },
  {
    key: 'D',
    label: 'Default',
    command: 'ccs',
    color: 'hover:bg-primary/20 hover:border-primary/50',
  },
];

// System status items
const SYSTEM_ITEMS = [
  { id: 'api', label: 'API Keys', icon: Key, path: '/api' },
  { id: 'oauth', label: 'OAuth', icon: Zap, path: '/cliproxy' },
  { id: 'accounts', label: 'Accounts', icon: Users, path: '/accounts' },
  { id: 'health', label: 'Doctor', icon: Stethoscope, path: '/health' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'shared', label: 'Shared', icon: Database, path: '/shared' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { data: overview, isLoading: isOverviewLoading } = useOverview();
  const { data: shared, isLoading: isSharedLoading } = useSharedSummary();
  const { data: health, isLoading: isHealthLoading } = useHealth();
  const { data: cliproxyAuth } = useCliproxyAuth();

  if (isOverviewLoading || isSharedLoading || isHealthLoading) {
    return <HomePageSkeleton />;
  }

  const healthPercent = health?.summary
    ? Math.round((health.summary.passed / health.summary.total) * 100)
    : 0;
  const healthStatus = overview?.health?.status ?? 'ok';

  // Build provider status from auth data
  const providerStatus = PROVIDERS.map((provider) => {
    const authInfo = cliproxyAuth?.authStatus?.find((a) => a.provider === provider.id);
    return {
      ...provider,
      authenticated: authInfo?.authenticated ?? false,
      accounts: authInfo?.accounts?.length ?? 0,
    };
  });

  return (
    <div className="min-h-screen">
      {/* Subtle grid background */}
      <div className="fixed inset-0 -z-10 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Configuration Warning - Full Width */}
        {shared?.symlinkStatus && !shared.symlinkStatus.valid && (
          <Alert
            variant="warning"
            className="animate-in zoom-in-95 duration-300 border-amber-500/30 bg-amber-500/5"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Required</AlertTitle>
            <AlertDescription>{shared.symlinkStatus.message}</AlertDescription>
          </Alert>
        )}

        {/* Main Status Board Grid - Full Width */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Hero + System Health */}
          <div className="xl:col-span-4 space-y-6">
            {/* Hero Card with Logo */}
            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <CcsLogo size="lg" showText={false} />
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">CCS</h1>
                    <p className="text-sm text-muted-foreground">Control Center</p>
                  </div>
                  <Badge variant="outline" className="ml-auto font-mono text-xs">
                    v{overview?.version ?? '0.0.0'}
                  </Badge>
                </div>

                {/* Live Clock */}
                <div className="text-center py-6 border-y border-border/30">
                  <LiveClock />
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                    System Time
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-primary">
                      {overview?.profiles ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Profiles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-primary">
                      {overview?.cliproxy ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">OAuth</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-primary">
                      {overview?.accounts ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Accounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health Card */}
            <Card
              className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate('/health')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    System Health
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      'px-2 py-0.5 text-xs',
                      healthStatus === 'ok' &&
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
                      healthStatus === 'warning' &&
                        'bg-amber-500/10 text-amber-500 border-amber-500/30',
                      healthStatus === 'error' && 'bg-red-500/10 text-red-500 border-red-500/30'
                    )}
                  >
                    {healthStatus === 'ok' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : healthStatus === 'warning' ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {healthStatus === 'ok'
                      ? 'Healthy'
                      : healthStatus === 'warning'
                        ? 'Degraded'
                        : 'Issues'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Health Score</span>
                    <span className="font-mono font-bold">{healthPercent}%</span>
                  </div>
                  <Progress
                    value={healthPercent}
                    className={cn(
                      'h-2',
                      healthStatus === 'ok' && '[&>[role=progressbar]]:bg-emerald-500',
                      healthStatus === 'warning' && '[&>[role=progressbar]]:bg-amber-500',
                      healthStatus === 'error' && '[&>[role=progressbar]]:bg-red-500'
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{health?.summary?.passed ?? 0} passed</span>
                    <span>{health?.summary?.warnings ?? 0} warnings</span>
                    <span>{health?.summary?.errors ?? 0} errors</span>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4 text-xs text-primary">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column: Provider Status + Quick Launch */}
          <div className="xl:col-span-5 space-y-6">
            {/* Provider Status Board */}
            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                    Provider Status
                  </h3>
                  <button
                    onClick={() => navigate('/cliproxy')}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Manage <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-4">
                  {providerStatus.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      {/* Status Indicator */}
                      <div className="relative">
                        <Circle
                          className={cn(
                            'w-3 h-3 fill-current',
                            provider.authenticated ? 'text-emerald-500' : 'text-muted-foreground/30'
                          )}
                        />
                        {provider.authenticated && (
                          <span className="absolute inset-0 animate-ping">
                            <Circle className="w-3 h-3 fill-emerald-500 opacity-50" />
                          </span>
                        )}
                      </div>

                      {/* Provider Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{provider.name}</span>
                          {provider.authenticated && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {provider.accounts} {provider.accounts === 1 ? 'account' : 'accounts'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {provider.authenticated ? 'Connected' : 'Not authenticated'}
                        </p>
                      </div>

                      {/* Status Bar */}
                      <div className="w-24">
                        <Progress
                          value={provider.authenticated ? 100 : 0}
                          className={cn(
                            'h-1.5',
                            provider.authenticated && '[&>[role=progressbar]]:bg-emerald-500'
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Launch Grid */}
            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-muted-foreground" />
                    Quick Launch
                  </h3>
                  <span className="text-xs text-muted-foreground">Click to copy</span>
                </div>

                <div className="grid grid-cols-6 gap-3">
                  {QUICK_LAUNCH.map((item) => (
                    <button
                      key={item.key}
                      className={cn(
                        'group flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-muted/10 transition-all',
                        item.color
                      )}
                      onClick={() => navigator.clipboard.writeText(item.command)}
                      title={item.command}
                    >
                      <kbd className="w-10 h-10 flex items-center justify-center rounded-lg bg-background border border-border/50 font-mono text-lg font-bold group-hover:border-current transition-colors">
                        {item.key}
                      </kbd>
                      <span className="text-[10px] text-muted-foreground group-hover:text-current transition-colors">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Navigation + Resources */}
          <div className="xl:col-span-3 space-y-6">
            {/* System Navigation */}
            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  Navigation
                </h3>

                <div className="space-y-2">
                  {SYSTEM_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all text-left group"
                        onClick={() => navigate(item.path)}
                      >
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="flex-1 text-sm">{item.label}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Shared Resources */}
            <Card
              className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate('/shared')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    Shared Resources
                  </h3>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <p className="text-xl font-bold font-mono text-primary">
                      {shared?.commands ?? 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Commands
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <p className="text-xl font-bold font-mono text-primary">
                      {shared?.skills ?? 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Skills
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/20">
                    <p className="text-xl font-bold font-mono text-primary">
                      {shared?.agents ?? 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Agents
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uptime Indicator */}
            <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-50" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">System Online</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Config server running
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader component - Full Width
function HomePageSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-4 space-y-6">
          <div className="rounded-xl border p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-2 w-full mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>

        {/* Center Column */}
        <div className="xl:col-span-5 space-y-6">
          <div className="rounded-xl border p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
          <div className="rounded-xl border p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-3 space-y-6">
          <div className="rounded-xl border p-6 space-y-2">
            <Skeleton className="h-4 w-24 mb-4" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
          <div className="rounded-xl border p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
