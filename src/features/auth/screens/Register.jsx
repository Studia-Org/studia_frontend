import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../../../context/AuthContext";
import { message } from "antd";
import { API } from "../../../constant";
import { getToken, setToken } from "../../../helpers";
import { UserInformation } from '../components/UserInformation';
import { UserObjectives } from '../components/UserObjectives';


const Register = () => {
  const [loading, setLoading] = useState(false);
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
    profile_photo: null,
    landscape_photo: [300],
  });
  const { email, password, username, name, repassword, university, description } = formData;

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [pageSelector, setPageSelector] = useState(1)
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoUpload = async (data) => {
    const photoFormData = new FormData();
    photoFormData.append("files", profilePhoto[0]);
    const uploadPhoto = await fetch(`${API}/upload`, {
      method: 'POST',
      body: photoFormData,
    });
    const uploadPhotoData = await uploadPhoto.json();
    const photoId = uploadPhotoData[0].id;
    formData.profile_photo = photoId;
    await fetch(`${API}/users/${data.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        profile_photo: photoId,
      }),
    })
  }


  const registerAccount = async () => {
    try {
      setLoading(true);
      if (!email || !password || !repassword || !username || !name || !university || !description) {
        throw new Error("Please fill in all fields");
      }
      if (!profilePhoto) {
        throw new Error("Please upload a profile photo");
      }
      const response = await fetch(`${API}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (data?.error) {
        throw data?.error;
      } else {
        setToken(data.jwt);
        setUser(data.user);
        await handlePhotoUpload(data);
        message.success("Account created successfully");
        setLoading(false);
        navigate("/app/courses");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    } finally {
      setLoading(false);
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
          <UserInformation onChange={onChange} formData={formData} username={username}
            email={email} university={university} password={password} repassword={repassword} name={name} setPageSelector={setPageSelector} />
        )
      case 2:
        return (
          <UserObjectives setPageSelector={setPageSelector} description={description} onChange={onChange}
            registerAccount={registerAccount} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} loading={loading} />
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