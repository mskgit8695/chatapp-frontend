import Loading from "@/src/components/Loading";
import VerifyOtp from "@/src/components/VerifyOtp";
import { Suspense } from "react";

function Verify() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyOtp />
    </Suspense>
  );
}

export default Verify;
