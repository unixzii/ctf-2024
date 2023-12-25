import { useAtom } from "jotai";

import Input from "./input";
import { usernameAtom } from "./store";
import { isValidTwitterUsername } from "./utils";

export default function RegistrationSection() {
  const [username, setUsername] = useAtom(usernameAtom);

  return (
    <Input
      buttonLabel="Start"
      value={username}
      disabled={!!username}
      onSubmit={(value) => {
        if (isValidTwitterUsername(value)) {
          setUsername(value);
        } else {
          alert("Your input is not a valid Twitter username.");
        }
      }}
    />
  );
}
