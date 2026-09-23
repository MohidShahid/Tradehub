import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { accountActivation } from "@/services/accountService";
// import { toast } from "../components/ui/toast";
import { Verified, CircleX } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const AccountActivation = () => {
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    async function activateAccount(token) {
      try {
        setLoading(true);
        const response = await accountActivation(token);
        setIsVerified(response?.data?.success);
        setMessage(response?.data?.message);
        setLoading(false);
      } catch (error) {
        console.log(error.response);
        setMessage(error?.response?.data?.message);
        setIsVerified(false);
        setLoading(false);
      }
    }
    if (token) {
      activateAccount(token);
    }
  }, [token]);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh gap-6">
        <Spinner className={"text-(--color-primary-hover) size-16"} />
        <p className="text-3xl">Verifying your token...Please wait</p>
      </div>
    );
  } else {
    if (message && isVerified) {
      return (
        <div className="flex flex-col items-center justify-center h-dvh gap-6">
          <Verified className="size-16" />
          <p className="text-3xl">{message}</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-dvh gap-6">
          <CircleX  className="size-16" />
          <p className="text-3xl">{message}</p>
        </div>
      );
    }
  }
};

export default AccountActivation;
