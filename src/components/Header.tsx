import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@lifeforge/ui";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation("core.apiExplorer");

  return (
    <header className="w-full mb-12 flex items-center justify-between">
      <h1 className="flex items-center gap-2">
        <Icon icon="mynaui:api" className="text-5xl text-custom-400" />
        <div>
          <div className="text-2xl font-semibold">
            Lifeforge<span className="text-custom-400">.</span>
          </div>
          <div className="text-zinc-500 font-medium">{t("title")}</div>
        </div>
      </h1>
      <Button
        as="a"
        icon="uil:github"
        variant="plain"
        iconClassName="size-8"
        rel="noopener noreferrer"
        target="_blank"
        href="https://github.com/Lifeforge-app/lifeforge-api-explorer"
      />
    </header>
  );
}

export default Header;
