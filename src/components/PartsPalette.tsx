import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { DraggablePart } from './DraggablePart';
import svgPaths from "../imports/svg-9dovsjk6o1";
import sampleImage from 'figma:asset/efecdee845b2329c35e03e9821a8431922863309.png';

const bodyParts = [
  { id: 'sample-project', type: 'sample-project', image: sampleImage, category: 'body', name: 'Sample Project' },
];

const colorOptions = [
  { id: 'default', name: 'Default', hue: 0, saturation: 1 },
  { id: 'blue', name: 'Blue', hue: 200, saturation: 1.2 },
  { id: 'green', name: 'Green', hue: 120, saturation: 1.1 },
  { id: 'pink', name: 'Pink', hue: 320, saturation: 1.3 },
  { id: 'purple', name: 'Purple', hue: 280, saturation: 1.2 },
  { id: 'orange', name: 'Orange', hue: 30, saturation: 1.4 },
];

const eyeParts = [
  { id: 'googly', type: 'googly', category: 'eyes', name: 'Googly Eyes' },
  { id: 'sleepy', type: 'sleepy', category: 'eyes', name: 'Sleepy Eyes' },
  { id: 'wink', type: 'wink', category: 'eyes', name: 'Winking Eyes' },
  { id: 'sparkle', type: 'sparkle', category: 'eyes', name: 'Sparkle Eyes' },
];

const mouthParts = [
  { id: 'happy', type: 'happy', category: 'mouth', name: 'Happy Mouth' },
  { id: 'goofy', type: 'goofy', category: 'mouth', name: 'Goofy Mouth' },
  { id: 'surprised', type: 'surprised', category: 'mouth', name: 'Surprised Mouth' },
  { id: 'toothy', type: 'toothy', category: 'mouth', name: 'Toothy Mouth' },
];

const accessoryParts = [
  { id: 'hat', type: 'hat', color: '#ff7675', category: 'accessory', name: 'Party Hat' },
  { id: 'bow', type: 'bow', color: '#fd79a8', category: 'accessory', name: 'Bow Tie' },
  { id: 'glasses', type: 'glasses', category: 'accessory', name: 'Glasses' },
  { id: 'flower', type: 'flower', color: '#fdcb6e', category: 'accessory', name: 'Flower' },
];

const backgroundOptions = [
  { id: 'gradient', type: 'gradient', category: 'background', name: 'Teal Gradient' },
  { id: 'solid', type: 'solid', category: 'background', name: 'Blue Solid' },
  { id: 'pattern', type: 'pattern', category: 'background', name: 'Purple Pattern' },
];

interface PartsPaletteProps {
  selectedParts: {
    body: any;
    eyes: any;
    mouth: any;
    accessories: any[];
    color: any;
    background: any;
  };
  onPartChange: (category: string, part: any) => void;
}

const ChevronDown = () => (
  <div className="shrink-0 size-5">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#FF10C3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </div>
);

const Droplet = () => (
  <div className="shrink-0 size-5">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path
        d={svgPaths.p141a4200}
        stroke="#FF10C3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </div>
);

export function PartsPalette({ selectedParts, onPartChange }: PartsPaletteProps) {
  const [openSections, setOpenSections] = useState<string[]>(['body']);

  const handleSectionToggle = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderAccordionHeader = (title: string, Icon: React.ComponentType, value: string) => (
    <AccordionTrigger 
      className="bg-white h-14 rounded-[56px] border border-[#dbe0e5] px-[25px] py-[17px] hover:border-[#FF10C3] focus:border-[#FF10C3] transition-colors [&[data-state=open]]:border-[#FF10C3] [&[data-state=open]]:bg-gray-50"
      onClick={() => handleSectionToggle(value)}
    >
      <div className="flex items-center gap-3 w-full">
        <span className="shrink-0 font-['Space_Grotesk'] font-normal text-[#61758a] text-[16px] leading-[24px]">
          {title}
        </span>
        <Icon />
        <div className="flex-1" />
        <ChevronDown />
      </div>
    </AccordionTrigger>
  );

  const renderColorPicker = () => (
    <AccordionItem value="color" className="border-none">
      {renderAccordionHeader('Colour', Droplet, 'color')}
      <AccordionContent className="pt-4 pb-0">
        <div className="grid grid-cols-3 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              onClick={() => onPartChange('color', color)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedParts.color?.id === color.id 
                  ? 'border-[#FF10C3] bg-pink-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300" 
                  style={{ background: color.id === 'default' ? '#e5e7eb' : `hsl(${color.hue}, 70%, 60%)` }}
                />
                <span className="text-sm font-['Space_Grotesk'] text-gray-700">{color.name}</span>
              </div>
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderBackgroundPicker = () => (
    <AccordionItem value="background" className="border-none">
      {renderAccordionHeader('Background', Droplet, 'background')}
      <AccordionContent className="pt-4 pb-0">
        <div className="grid grid-cols-2 gap-3">
          {backgroundOptions.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onPartChange('background', bg)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedParts.background?.id === bg.id 
                  ? 'border-[#FF10C3] bg-pink-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg border border-gray-300 ${
                  bg.type === 'gradient' ? 'bg-gradient-to-br from-cyan-400 to-teal-500' :
                  bg.type === 'solid' ? 'bg-blue-400' : 'bg-purple-400'
                }`} />
                <span className="text-sm font-['Space_Grotesk'] text-gray-700">{bg.name}</span>
              </div>
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderBodySelector = () => (
    <AccordionItem value="body" className="border-none">
      {renderAccordionHeader('Body', ChevronDown, 'body')}
      <AccordionContent className="pt-4 pb-0">
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => selectedParts.body ? onPartChange('body', null) : onPartChange('body', bodyParts[0])}
            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              selectedParts.body 
                ? 'border-[#FF10C3] bg-pink-50' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src={bodyParts[0].image} 
                    alt="Sample Project"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-sm font-bold text-gray-800 truncate font-['Space_Grotesk']">
                  {bodyParts[0].name}
                </h4>
                <p className="text-xs text-gray-500 font-['Space_Grotesk']">
                  {selectedParts.body ? 'Click to remove' : 'Click to select as background'}
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className={`w-4 h-4 rounded-full ${
                  selectedParts.body ? 'bg-[#FF10C3]' : 'bg-gray-300'
                }`} />
              </div>
            </div>
          </button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderDraggablePartSection = (title: string, parts: any[], value: string) => (
    <AccordionItem value={value} className="border-none">
      {renderAccordionHeader(title, ChevronDown, value)}
      <AccordionContent className="pt-4 pb-0">
        <div className="grid grid-cols-1 gap-3">
          {parts.map((part) => (
            <DraggablePart key={part.id} part={part} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-sm font-['Space_Grotesk'] text-[#61758a] mb-2 px-4">
          🎨 Select body and colors, then drag other parts to the canvas
        </p>
      </div>
      
      <Accordion 
        type="multiple" 
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {renderColorPicker()}
            {renderBodySelector()}
            {renderDraggablePartSection('Eyes', eyeParts, 'eyes')}
          </div>
          
          <div className="space-y-4">
            {renderBackgroundPicker()}
            {renderDraggablePartSection('Mouth', mouthParts, 'mouth')}
            {renderDraggablePartSection('Accessories', accessoryParts, 'accessories')}
          </div>
        </div>
      </Accordion>
    </div>
  );
}