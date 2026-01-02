import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface YahooPingResponse {
  ok: boolean;
  owner_id: string;
  yahoo?: {
    status: number;
    path: string;
    endpoint_group: string;
    response_bytes: number;
    checksum: string;
    duration_ms: number;
    request_id: string;
  };
  error_type?: string;
  error_message?: string;
}

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YahooPingResponse | null>(null);
  const ownerId = localStorage.getItem('owner_id') || 'default_owner';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleYahooPing = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${apiUrl}/debug/yahoo/ping?owner_id=${encodeURIComponent(ownerId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data: YahooPingResponse = await response.json();
      setResult(data);

      if (data.ok) {
        toast.success(`Yahoo API connected! (${data.yahoo?.duration_ms}ms)`);
      } else {
        toast.error(`Yahoo API error: ${data.error_type}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Ping failed: ${errorMsg}`);
      setResult({
        ok: false,
        owner_id: ownerId,
        error_type: 'network_error',
        error_message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your NBA Fantasy dashboard</p>
        </div>

        {/* Yahoo API Verification Card */}
        <Card>
          <CardHeader>
            <CardTitle>Yahoo API Verification</CardTitle>
            <CardDescription>
              Test real-time connection to Yahoo Fantasy Sports API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Owner ID: <span className="font-mono font-semibold">{ownerId}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                API URL: <span className="font-mono text-xs">{apiUrl}</span>
              </p>
            </div>

            <Button
              onClick={handleYahooPing}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Yahoo Connection'
              )}
            </Button>

            {result && (
              <div className="space-y-3 mt-4">
                {result.ok ? (
                  <>
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        ✅ Successfully connected to Yahoo Fantasy Sports API
                      </AlertDescription>
                    </Alert>

                    {result.yahoo && (
                      <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm font-mono">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-semibold">{result.yahoo.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Path:</span>
                          <span className="font-semibold">{result.yahoo.path}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Bytes:</span>
                          <span className="font-semibold">{result.yahoo.response_bytes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-semibold">{result.yahoo.duration_ms}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Checksum:</span>
                          <span className="font-semibold text-xs truncate">{result.yahoo.checksum.slice(0, 16)}...</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Request ID:</span>
                          <span className="font-semibold text-xs truncate">{result.yahoo.request_id}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        ❌ {result.error_type}: {result.error_message}
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>
              This test makes a real OAuth 1.0a request to Yahoo Fantasy Sports API.
            </p>
            <p>
              The response includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Checksum:</strong> SHA256 hash of response (proves real data)</li>
              <li><strong>Response Bytes:</strong> Size of actual API response</li>
              <li><strong>Duration:</strong> Round-trip time to Yahoo servers</li>
              <li><strong>Request ID:</strong> Unique ID to trace in backend logs</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
