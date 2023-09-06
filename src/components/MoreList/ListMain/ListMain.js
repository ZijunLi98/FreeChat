import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import styles from "./ListMain.module.scss";
import { UserContext } from "../../../contexts/UserContext";
import NavChatItem from "../NavChatItem/NavChatItem";

import {
  RiBattery2ChargeLine,
  RiSettings3Line,
  RiLogoutBoxRLine,
  RiUserShared2Line,
} from "react-icons/ri";
import PopupCard from "../PopupCard/PopupCard";

function ListMain({ onClose }) {
  const [current, setCurrent] = useState("");
  const userContext = useContext(UserContext);
  const { chatList, userDispatch, inviteCode } = userContext;

  return (
    <div className={styles.listContent}>
      <nav className={styles.navBar}>
        <div
          className={`${styles.newChat} ${styles.actionBtn}`}
          onClick={() => setCurrent("newChat")}
        >
          新建聊天
        </div>
        <div className={styles.chatRoomListScroller}>
          <div className={styles.chatRoomList}>
            {chatList.map((el) => (
              <NavChatItem
                key={el.uuid}
                uuid={el.uuid}
                title={el.title}
                onClose={onClose}
                userDispatch={userDispatch}
              />
            ))}
          </div>
        </div>
        <div className={styles.actionBtn}>
          <RiUserShared2Line />
          您的邀请码：{inviteCode}
        </div>
        <div className={styles.actionBtn} onClick={() => setCurrent("topup")}>
          <RiBattery2ChargeLine />
          充值
        </div>
        <div className={styles.actionBtn}>
          <RiSettings3Line />
          设定 (施工中)
        </div>
        <div className={styles.actionBtn}>
          <RiLogoutBoxRLine />
          登出 (施工中)
        </div>
      </nav>
      {current !== "" &&
        createPortal(
          <PopupCard
            status={current}
            onClose={setCurrent}
            userDispatch={userDispatch}
          />,
          document.getElementById("navigation")
        )}
    </div>
  );
}

export default ListMain;
