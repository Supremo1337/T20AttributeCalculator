import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { configAtom } from "../../atoms/config";
import { Toggle } from "../flowbite/Toggle";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

export function ConfigModal() {
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [config, setConfig] = useAtom(configAtom);

  const t = useTranslations("Config");

  return (
    <>
      <button
        className="absolute right-4 top-4 rounded-full"
        onClick={() => setOpenConfigModal(true)}
      >
        <Cog8ToothIcon className="w-8 text-white transition hover:rotate-180 active:opacity-50" />
      </button>

      <Dialog
        open={openConfigModal}
        onClose={() => setOpenConfigModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-red-800 p-6">
            <Dialog.Title className="font-sans text-3xl font-bold text-white">
              {t.raw("title")}
            </Dialog.Title>
            <Dialog.Description className="font-sans text-white">
              {t.raw("description")}
            </Dialog.Description>

            <ul className="my-4 flex flex-col gap-1 text-white">
              {Object.entries(config).map(([key, value]) => {
                // Sorry for the 'any', trust me, I've tried
                return (
                  <li key={key}>
                    <Toggle
                      checked={value}
                      label={t.raw(`configOptions.${key}` as any)}
                      onChange={(e) => {
                        setConfig({
                          ...config,
                          [key]: e.target.checked,
                        });
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
