import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import { RadioGroup, Radio } from "../input/Radio";

export default function RadioButtons() {
  const [selectedValue, setSelectedValue] = useState<string>("option2");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };
  return (
    <ComponentCard title="Radio Buttons">
      <RadioGroup
        value={selectedValue}
        onValueChange={handleRadioChange}
        className="flex flex-wrap items-center gap-8"
      >
        <Radio
          id="radio1"
          value="option1"
          label="Default"
        />
        <Radio
          id="radio2"
          value="option2"
          label="Selected"
        />
        <Radio
          id="radio3"
          value="option3"
          label="Disabled"
          disabled={true}
        />
      </RadioGroup>
    </ComponentCard>
  );
}
