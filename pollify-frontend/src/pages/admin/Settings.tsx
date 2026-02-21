import { IconSettings } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Settings() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system-wide settings and view platform health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <IconSettings className="size-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-1">System Configuration</h3>
              <p className="text-sm text-muted-foreground">Migration health, database status, and system configuration</p>
              <p className="text-xs text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
