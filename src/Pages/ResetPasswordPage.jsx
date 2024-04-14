import { useState } from "react";
import ResetPassword from "../Components/LandingPage/ResetPassword";
import BaseHeader from "../Components/MyScrum/Main/baseHeader";
import { IsValidationTokenValid } from "../functions/Users/IsValidationTokenValid";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function ResetPasswordPage() {

  return (
    <>

        <div>
          <BaseHeader />
          <ResetPassword />
        </div>
   
    </>
  );
  
}
export default ResetPasswordPage;