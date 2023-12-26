import { useAtom } from "jotai";

import Input from "./input";
import { usernameAtom } from "./store";
import { isValidTwitterUsername } from "./utils";

export default function RegistrationSection() {
  const [username, setUsername] = useAtom(usernameAtom);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Register Your Twitter ID</h2>
      <p>
        Fill in your Twitter ID (not display name) to help us identify you and
        record your score.
      </p>
      <Input
        placeholder="Twitter ID"
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
    </>
  );
}
