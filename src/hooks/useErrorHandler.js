import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function useErrorHandler() {
  const navigate = useNavigate();
  const catchAsync = useCallback(
    (fn) => {
      return (event) => {
        fn(event).catch((error) => {
          if (error.code === "ERR_NETWORK") {
            toast.error("网络错误，请稍后再试！", {
              theme: "colored",
            });
            return;
          }
          if (error.response.status === 401) {
            toast.error(error.response.data.respMsg, {
              theme: "colored",
            });
            navigate("/");
          } else {
            toast.error("Something went wrong!", {
              theme: "colored",
            });
          }
        });
      };
    },
    [navigate]
  );

  return { catchAsync };
}
