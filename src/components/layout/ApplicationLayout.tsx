import { useAtom } from "jotai";
import { Fragment, useCallback, useEffect, useState } from "react";
import { activeCharacter, getDefaultCharacter } from "../../atoms/characters";
import type { ValidBaseAttribute } from "../../functions/AttributeCalculator";
import { getAttributeCost } from "../../functions/AttributeCalculator";
import { AttributeGroup } from "../AttributeSection";
import { Logo } from "../svg/Logo";
import { Listbox } from "@headlessui/react";
import { RacialBonusMap } from "../../resources/RacialBonusMap";
import NoSsr from "../NoSsr";
import { useTranslations } from "next-intl";
import type { Race } from "../../types/BookResources";
import { configAtom } from "../../atoms/config";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";

interface SelectRaceModalProps {
  setOpenSelectRaceModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ApplicationLayout = ({
  setOpenSelectRaceModal,
}: SelectRaceModalProps) => {
  const [char, setChar] = useAtom(activeCharacter);
  const raceOptions = [...RacialBonusMap.keys()];
  const [config] = useAtom(configAtom);

  const [totalPointsChange, setTotalPointsChange] = useState(char.points.total);

  const t = useTranslations("Main");

  const changeTotalPoints = useCallback(
    (newTotal?: number) => {
      setChar({
        ...getDefaultCharacter(),
        points: {
          total: newTotal ?? totalPointsChange,
          left: newTotal ?? totalPointsChange,
        },
      });
    },
    [totalPointsChange, setChar]
  );

  useEffect(() => {
    if (char.race && RacialBonusMap.get(char.race)?.type === "choice") {
      setChar((char) => ({
        ...char,
        attrs: {
          strength: { ...char.attrs.strength, race: 0 },
          dexterity: { ...char.attrs.dexterity, race: 0 },
          constitution: { ...char.attrs.constitution, race: 0 },
          intelligence: { ...char.attrs.intelligence, race: 0 },
          wisdom: { ...char.attrs.wisdom, race: 0 },
          charisma: { ...char.attrs.charisma, race: 0 },
        },
      }));
    }
  }, [char.race, setChar]);

  useEffect(() => {
    const totalCost =
      getAttributeCost(char.attrs.strength.base as ValidBaseAttribute) +
      getAttributeCost(char.attrs.dexterity.base as ValidBaseAttribute) +
      getAttributeCost(char.attrs.constitution.base as ValidBaseAttribute) +
      getAttributeCost(char.attrs.intelligence.base as ValidBaseAttribute) +
      getAttributeCost(char.attrs.wisdom.base as ValidBaseAttribute) +
      getAttributeCost(char.attrs.charisma.base as ValidBaseAttribute);

    setChar((char) => ({
      ...char,
      points: { total: char.points.total, left: char.points.total - totalCost },
    }));
  }, [char.attrs, setChar]);

  useEffect(() => {
    if (
      !config.editablePoints &&
      getDefaultCharacter().points.total !== char.points.total
    ) {
      changeTotalPoints(getDefaultCharacter().points.total);
    }
  }, [config, char, changeTotalPoints]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#4b0e0e] py-16 bg-hero-topography">
      <Logo className="h-24 w-24" />
      <div className="flex flex-col items-center justify-center px-4">
        <h1 className="text-center font-display text-4xl font-bold text-white">
          T20AC
        </h1>
        <pre className="whitespace-pre-line text-center font-normal text-white">
          {t("subheading")}
        </pre>
      </div>
      <NoSsr>
        <section title="Character Info" className="flex gap-4">
          <button onClick={() => setOpenSelectRaceModal(true)}>
            <Cog8ToothIcon className="w-8 text-white transition hover:rotate-180 active:opacity-50" />
          </button>
          <Listbox
            as="div"
            className="relative"
            value={char.race}
            onChange={(race: Race) => setChar((char) => ({ ...char, race }))}
          >
            <Listbox.Button className="w-36 rounded bg-red-600 px-2 py-1 text-white hover:bg-red-900 active:opacity-50">
              {t("raceSelector.button", { race: t(`races.${char.race}`) })}
            </Listbox.Button>
            <Listbox.Options className="absolute z-50 mt-4 flex max-h-[50vh] w-full flex-col overflow-y-auto overscroll-auto rounded bg-red-900 outline-none">
              {raceOptions.map((race) => (
                <Listbox.Option key={race} value={race} as={Fragment}>
                  {({ active, selected }) => (
                    <button
                      className={`:bg-white cursor-pointer p-2 text-center text-white active:brightness-150 ${
                        active && "bg-red-700"
                      } ${selected && "border-2 border-red-200"}`}
                    >
                      {t(`races.${race}`)}
                    </button>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
          <button
            onClick={() => setChar(getDefaultCharacter())}
            className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-900 active:opacity-50"
          >
            {t("resetButton")}
          </button>
        </section>

        <label
          className={`flex items-center gap-2 text-white ${
            !config.editablePoints && "hidden"
          }`}
        >
          {t("maxPoints")}
          <input
            className="w-16 rounded-md bg-red-500 text-center text-white outline-white focus:bg-red-500"
            type="number"
            value={totalPointsChange}
            onChange={(e) => setTotalPointsChange(parseInt(e.target.value))}
          />
          <button
            className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-900 active:opacity-50"
            onClick={() => changeTotalPoints()}
          >
            {t.raw("changePointsButton")}
          </button>
        </label>
        <label className="flex gap-2 text-white">
          {t("pointsLeft")}
          <input
            className="w-16 rounded-md bg-red-600 text-center text-white opacity-100 outline-white disabled:text-white"
            type="number"
            value={char.points.left}
            disabled
          />
        </label>
        <div className="flex flex-col items-center gap-2 ">
          <header className="flex w-full justify-between px-1 font-bold text-white">
            <span>{t("calculator.heading.name")}</span>
            <span>{t("calculator.heading.base")}</span>
            <span>{t("calculator.heading.racial")}</span>
            <span className={config.othersPointsSection ? "" : "hidden"}>
              {t("calculator.heading.other")}
            </span>
            <span>{t("calculator.heading.total")}</span>
          </header>
          <AttributeGroup name="strength" />
          <AttributeGroup name="dexterity" />
          <AttributeGroup name="constitution" />
          <AttributeGroup name="intelligence" />
          <AttributeGroup name="wisdom" />
          <AttributeGroup name="charisma" />
        </div>
      </NoSsr>
    </div>
  );
};
