import { PulseLoader } from "react-spinners";
import styles from "./loader.module.scss";

export default function Loader() {
  return (
    <div className={styles.loader}>
      <PulseLoader color="#36d7b7" size={20} speedMultiplier={3} />
    </div>
  );
}
