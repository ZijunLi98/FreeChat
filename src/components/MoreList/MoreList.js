import styles from "./MoreList.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import ListMain from "./ListMain/ListMain";

function MoreList({ onClose }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgCover}></div>
      <div className={styles.listWrapper}>
        <div className={styles.listContainer}>
          <div className={styles.closeBtn}>
            <button onClick={onClose}>
              <AiOutlineClose />
            </button>
          </div>
          <ListMain onClose={onClose} />
        </div>
        <div className={styles.listShrink}></div>
      </div>
    </div>
  );
}

export default MoreList;
