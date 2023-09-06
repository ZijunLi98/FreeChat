import { useRouteError, useNavigate } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  let title = "unknown errors";
  let message = "unknown errors";
  const navivate = useNavigate();

  if (error.status === 404) {
    title = "This url is not exist";
    message = "Please go back to login page";
  }

  setTimeout(() => {
    navivate("/");
  }, 2000);

  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      <p>2s后返回主页</p>
    </div>
  );
}

export default ErrorPage;
