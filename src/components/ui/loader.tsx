import { PulseLoader } from "react-spinners";

export default function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <PulseLoader color="#36d7b7" size={20} speedMultiplier={3} />
    </div>
  );
}
