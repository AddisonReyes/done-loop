import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { SettingsRepository } from "@/features/settings/repositories/settings-repository";
import type { UserLastActiveRoute } from "@/features/settings/types";

export default function HomeScreen() {
  const [route, setRoute] = useState<UserLastActiveRoute | null>(null);

  useEffect(() => {
    let isMounted = true;

    void SettingsRepository.get()
      .then((settings) => {
        if (isMounted) {
          setRoute(settings.lastActiveRoute);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRoute("/habits");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return route ? <Redirect href={route} /> : null;
}
