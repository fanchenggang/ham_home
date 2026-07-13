import { BrainCircuit, Globe2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  Textarea,
} from "@hamhome/ui";
import { useTranslation } from "react-i18next";

interface TabAutoGroupSettingsCardProps {
  supported: boolean;
  aiAutoGroupEnabled: boolean;
  aiAutoGroupInstructions: string;
  domainAutoGroupEnabled: boolean;
  onAiAutoGroupEnabledChange: (enabled: boolean) => void;
  onDomainAutoGroupEnabledChange: (enabled: boolean) => void;
  onAiAutoGroupInstructionsChange: (instructions: string) => void;
  onAiAutoGroupInstructionsSave: () => void;
}

export function TabAutoGroupSettingsCard({
  supported,
  aiAutoGroupEnabled,
  aiAutoGroupInstructions,
  domainAutoGroupEnabled,
  onAiAutoGroupEnabledChange,
  onDomainAutoGroupEnabledChange,
  onAiAutoGroupInstructionsChange,
  onAiAutoGroupInstructionsSave,
}: TabAutoGroupSettingsCardProps) {
  const { t } = useTranslation("bookmark");
  const aiToggleId = "ai-tab-group-enabled";
  const domainToggleId = "domain-tab-group-enabled";
  const aiInstructionsId = "ai-tab-group-instructions";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("tabGroups.autoGroup.title")}
        </CardTitle>
        <CardDescription>
          {t("tabGroups.autoGroup.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <Label htmlFor={aiToggleId}>
                {t("tabGroups.aiAutoGroup.title")}
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("tabGroups.aiAutoGroup.description")}
              </p>
            </div>
          </div>
          <Switch
            id={aiToggleId}
            data-testid="ai-auto-group-switch"
            checked={aiAutoGroupEnabled}
            disabled={!supported || domainAutoGroupEnabled}
            onCheckedChange={onAiAutoGroupEnabledChange}
            aria-label={t("tabGroups.aiAutoGroup.title")}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Globe2 className="h-4 w-4" />
            </div>
            <div>
              <Label htmlFor={domainToggleId}>
                {t("tabGroups.domainAutoGroup.title")}
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("tabGroups.domainAutoGroup.description")}
              </p>
            </div>
          </div>
          <Switch
            id={domainToggleId}
            data-testid="domain-auto-group-switch"
            checked={domainAutoGroupEnabled}
            disabled={!supported || aiAutoGroupEnabled}
            onCheckedChange={onDomainAutoGroupEnabledChange}
            aria-label={t("tabGroups.domainAutoGroup.title")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={aiInstructionsId}>
            {t("tabGroups.aiAutoGroup.instructionsLabel")}
          </Label>
          <Textarea
            id={aiInstructionsId}
            data-testid="ai-auto-group-instructions"
            value={aiAutoGroupInstructions}
            disabled={!supported || domainAutoGroupEnabled}
            maxLength={1000}
            rows={3}
            placeholder={t("tabGroups.aiAutoGroup.instructionsPlaceholder")}
            onChange={(event) => onAiAutoGroupInstructionsChange(event.target.value)}
            onBlur={onAiAutoGroupInstructionsSave}
          />
          <p className="text-xs text-muted-foreground">
            {t("tabGroups.aiAutoGroup.instructionsHint")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
