/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useEffect, useState } from "react";
import "./i18n";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, LoadingScreen } from "@lifeforge/ui";
import _ from "lodash";
import PersonalizationProvider from "./providers/PersonalizationProvider";
import LifeforgeUIProviderWrapper from "./providers/LifeforgeUIProviderWrapper";
import Header from "./components/Header";

const LocaleAdmin = (): React.ReactElement => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [themeConfig, setThemeConfig] = useState<{
    fontFamily: string;
    theme: "light" | "dark" | "system";
    rawThemeColor: string;
    bgTemp: string;
    language: string;
  }>({
    fontFamily: "Inter",
    theme: "system",
    rawThemeColor: "theme-lime",
    bgTemp: "bg-zinc",
    language: "en",
  });

  const failAuth = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthed(false);
  };

  const verifyToken = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!token) {
      failAuth();
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/user/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      failAuth();
    }

    const data = await res.json();

    if (data.state === "success") {
      setIsAuthed(true);
      const { userData } = data.data;

      setThemeConfig({
        fontFamily: userData.fontFamily || "Inter",
        theme: userData.theme || "system",
        rawThemeColor:
          (userData.color.startsWith("#")
            ? userData.color
            : `theme-${userData.color}`) || "theme-blue",
        bgTemp:
          (userData.bgTemp.startsWith("#")
            ? userData.bgTemp
            : `bg-${userData.bgTemp}`) || "bg-zinc",
        language: userData.language || "en",
      });
    } else {
      failAuth();
    }
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("token")) {
      document.cookie = `token=${new URLSearchParams(
        window.location.search
      ).get("token")}; path=/; expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}`;

      window.location.replace(window.location.origin);
    }

    if (document.cookie.includes("token")) {
      verifyToken();
    }
  }, []);

  return (
    <PersonalizationProvider isAuthed={isAuthed} config={themeConfig}>
      <LifeforgeUIProviderWrapper>
        <main className="w-full min-h-dvh flex flex-col p-12 bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50">
          <Suspense fallback={<LoadingScreen />}>
            <Header />
            {isAuthed ? (
              <div className="flex-center h-full flex-1 font-medium uppercase text-4xl tracking-widest">
                Nice
              </div>
            ) : (
              <div className="w-full h-full flex flex-1 items-center flex-col justify-center">
                <Icon icon="tabler:lock-access" className="text-9xl mb-4" />
                <h2 className="text-4xl">Unauthorized Personnel</h2>
                <p className="text-lg text-zinc-500 text-center mt-4">
                  Please authenticate through single sign-on (SSO) in the system
                  to access the locale editor.
                </p>
                <Button
                  as="a"
                  icon="tabler:hammer"
                  href={import.meta.env.VITE_FRONTEND_URL}
                  className="mt-16"
                >
                  Go to System
                </Button>
              </div>
            )}
          </Suspense>
        </main>
      </LifeforgeUIProviderWrapper>
    </PersonalizationProvider>
  );
};

export default LocaleAdmin;
