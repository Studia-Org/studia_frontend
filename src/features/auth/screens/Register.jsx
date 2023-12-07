import { React, useState } from 'react'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../../context/AuthContext";
import { Button } from "antd";
import { API } from "../../../constant";
import { Toast } from "../../../shared/elements/Toasts";
import { setToken } from "../../../helpers";
import { UserInformation } from '../components/UserInformation';
import { UserObjectives } from '../components/UserObjectives';

const Register = () => {

  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repassword: '',
    username: '',
    name: '',
    university: '',
    description: '',
    role_str: 'student',
    user_objectives: [],
    profile_photo: null,
    landscape_photo: [300],
  });
  const { email, password, username, name, repassword, university, description, user_objectives } = formData;

  const [pageSelector, setPageSelector] = useState(1)
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


  const registerAccount = async () => {
    try {
      const response = await fetch(`${API}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data?.error) {
        throw data?.error;
      } else {
        setToken(data.jwt);
        setUser(data.user);
        Toast.fire({
          icon: 'success',
          title: 'Account succesfully created'
        })
        navigate("/auth/login");
      }
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: 'error',
        text: error,
        title: 'Something went wrong'
      })
    }
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      registerAccount();
    }
  });

  function switchPage() {
    switch (pageSelector) {
      case 1:
        return (
          <UserInformation onChange={onChange} formData={formData} username={username} description={description}
            email={email} university={university} password={password} repassword={repassword} name={name} setPageSelector={setPageSelector} />
        )
      case 2:
        return (
          <UserObjectives setPageSelector={setPageSelector}/>
        )
      default:
        return (
          <UserInformation onChange={onChange} formData={formData} username={username} description={description}
            email={email} university={university} password={password} repassword={repassword} name={name} />
        )
    }
  }


  return (
    <div class="">
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js" defer></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"></script>
      <style>@import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css')</style>
      <div class="min-w-screen min-h-screen  flex items-center justify-center px-5 py-5 bg-gradient-to-r from-indigo-400  to-[#6e66d6]">
        {switchPage()}
      </div>
    </div>
  )
}

export default Register;