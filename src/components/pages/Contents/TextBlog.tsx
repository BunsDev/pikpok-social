import Button from "@components/atoms/Button";
import { getJwt } from "@src/services/pinataUtils";

const TextBlog = () => {
  return (
    <div>
      <Button variant="primary" onClick={getJwt}>Generate JWT</Button>
    </div>
  );
};

export default TextBlog;
