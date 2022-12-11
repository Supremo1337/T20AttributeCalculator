import { useAtom } from "jotai"
import { useEffect } from "react"
import { activeCharacter } from "../../atoms/characters"
import type { ValidBaseAttribute } from "../../functions/AttributeCalculator";
import { getAttributeCost } from "../../functions/AttributeCalculator"
import { AttributeGroup } from "../AttributeSection"
import { Logo } from "../svg/Logo"
import { Listbox } from '@headlessui/react'
import { RacialBonusMap } from "../../resources/RacialBonusMap";

export const ApplicationLayout = () => {
    const [char, setChar] = useAtom(activeCharacter)
    const raceOptions = [ ...RacialBonusMap.keys() ]

    useEffect(() => {
        if(char.race && RacialBonusMap.get(char.race)?.type === 'choice') {
            setChar((char) => ({
                ...char,
                attrs: {
                    strength: { ...char.attrs.strength, race: 0 },
                    dexterity: { ...char.attrs.dexterity, race: 0 },
                    constitution: { ...char.attrs.constitution, race: 0 },
                    intelligence: { ...char.attrs.intelligence, race: 0 },
                    wisdom: { ...char.attrs.wisdom, race: 0 },
                    charisma: { ...char.attrs.charisma, race: 0 },
                }
            }))
        }
    }, [char.race, setChar])

    useEffect(() => { 
        const totalCost = 
            getAttributeCost(char.attrs.strength.base as ValidBaseAttribute)
            + getAttributeCost(char.attrs.dexterity.base as ValidBaseAttribute)
            + getAttributeCost(char.attrs.constitution.base as ValidBaseAttribute)
            + getAttributeCost(char.attrs.intelligence.base as ValidBaseAttribute)
            + getAttributeCost(char.attrs.wisdom.base as ValidBaseAttribute)
            + getAttributeCost(char.attrs.charisma.base as ValidBaseAttribute)
            
        setChar((char) => ({
            ...char,
            points: { total: char.points.total, left: char.points.total - totalCost }
        }))
    }, [char.attrs, setChar])

    return <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-[#4b0e0e] bg-hero-topography py-12">
        <Logo className="h-24 w-24" />
        <div className="flex flex-col items-center justify-center px-4">
            <h1 className="text-white text-4xl font-bold font-display text-center">T20AC</h1>
            <pre className="text-white font-normal whitespace-pre-line text-center">An attribute calculator for Tormenta20 - Game of The Year Edition</pre>
        </div>
        <section>
            <Listbox 
                value={char.race}
                onChange={(race) => setChar((char) => ({ ...char, race }))} 
            >
                <Listbox.Button className="text-white bg-red-600 hover:bg-red-900 active:opacity-50 px-2 py-1 rounded">Race: {char.race || 'Other'}</Listbox.Button>
                <Listbox.Options className="">
                    {raceOptions.map((race) => (
                        <Listbox.Option
                            key={race}
                            value={race}
                        >
                            {race}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>

            </Listbox>
        </section>
        
        <div>
            <span className="text-white">Base Points left: {char.points.left}</span>
            
        </div>
        <div className="flex flex-col items-center gap-2 ">
            <header className="flex text-white w-full justify-between px-1 font-bold">
                <span>Name</span>
                <span>Base</span>
                <span>Racial</span>
                <span>Other</span>
                <span>Total</span>
            </header>
            <AttributeGroup name="strength" />
            <AttributeGroup name="dexterity" />
            <AttributeGroup name="constitution" />
            <AttributeGroup name="intelligence" />
            <AttributeGroup name="wisdom" />
            <AttributeGroup name="charisma" />
        </div>
    </div>
}