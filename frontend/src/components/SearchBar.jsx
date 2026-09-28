import { useState } from "react";
import { Field } from "./ui/field";

import { InputGroupInput, InputGroup, InputGroupAddon } from "./ui/input-group";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";

const SearchBar = ({removeRounded, setRemoveRounded, inputRef}) => {
  const [query, setQuery] = useState("");

  return (
    <Field className={"w-[40%]"}>
      <InputGroup className={`bg-white h-12 ${removeRounded ? "" : "rounded-full"} pl-2`} onClick={()=> setRemoveRounded(true)}>
        <InputGroupInput
        ref={inputRef}
          type="text"
          value={query}
          className={""}
          placeholder={"Search for products, brands and more..."}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
          }}
        />

        <InputGroupAddon align="inline-end">
          <Button className="p-0 w-10 h-10 rounded-full bg-[var(--color-accent)] cursor-pointer">
            <SearchIcon className="text-white" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};

export default SearchBar;
