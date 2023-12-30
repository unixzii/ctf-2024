import Input from "../input";

export default function Redeem() {
  return (
    <>
      <div className="max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-2">Redeem Code</h2>
        <p>
          Fill in the flag of the first challenge to redeem the red packet code.
        </p>
        <Input buttonLabel="Redeem" />
      </div>
    </>
  );
}
