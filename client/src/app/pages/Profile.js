import React, { useContext, useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { AppContext } from "../../scripts/contexts/AppProvider";
import { storeData } from "../../scripts/ipfs";
import { registerOrUpdate } from "../../scripts/account";
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

function Profile() {
  const { user, setUser } = useContext(AppContext);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);

  const ProfileSchema = Yup.object().shape({
    avatar: Yup.mixed().required("Required"),
    banner: Yup.mixed().required("Required"),
    username: Yup.string().required("Required"),
    email: Yup.string().required("Required").email("Email is invalid")
  });

  const formik = useFormik({
    initialValues: {
      avatar: null,
      banner: null,
      username: "",
      email: "",
      twitter: "",
      facebook: ""
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values) => {
      let tavatar = user.avatar;
      let tbanner = user.banner;
      if (values.avatar) {
        await Swal.fire({
          title: "Upload Avatar",
          didOpen: async () => {
            Swal.showLoading();
            tavatar = await storeData(values.avatar);
            Swal.close();
          }
        });
      }
      if (values.banner) {
        await Swal.fire({
          title: "Upload Avatar",
          didOpen: async () => {
            Swal.showLoading();
            tbanner = await storeData(values.banner);
            Swal.close();
          }
        });
      }

      let dataUri = null;
      await Swal.fire({
        title: "Upload Data",
        didOpen: async () => {
          Swal.showLoading();
          const jsonData = JSON.stringify({
            username: values.username,
            email: values.email,
            avatar: tavatar,
            banner: tbanner,
            twitter: values.twitter,
            facebook: values.facebook
          });
          dataUri = await storeData(jsonData);
          Swal.close();
        }
      });

      await Swal.fire({
        title: "Update",
        didOpen: async () => {
          Swal.showLoading();
          await registerOrUpdate(dataUri);
          setUser(user => ({...user, avatar: tavatar, banner: tbanner, username: values.username, isVerified: true}))
          Swal.close();
        }
      });
    }
  });

  useEffect(() => {
    if (user.avatar) {
      setAvatar(user.avatar);
    }
    if (user.banner) {
      setBanner(user.banner);
    }
  }, [user]);

  const onAvatarChange = (e) => {
    const image = URL.createObjectURL(e.target.files[0]);
    setAvatar(image);
    formik.setFieldValue("avatar", e.target.files[0]);
  };

  const onBannerChange = (e) => {
    const image = URL.createObjectURL(e.target.files[0]);
    setBanner(image);
    formik.setFieldValue("banner", e.target.files[0]);
  };

  return (
    <div>
      <GlobalStyles />
      <section
        id="subheader"
        className="text-light"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}>
        <div className="center-y relative text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="text-white">Edit Profile</h1>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-main" aria-label="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-1">
              <form id="form-create-item" className="form-border" onSubmit={formik.handleSubmit}>
                <div className="de_tab tab_simple">
                  <div className="de_tab_content">
                    <div className="tab-1">
                      <div className="row wow fadeIn">
                        <div className="col-lg-8 mb-sm-20">
                          <div className="field-set">
                            <h5>Username</h5>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter username"
                              {...formik.getFieldProps("username")}
                            />
                            {formik.touched.username && formik.errors.username ? (
                              <div className="invalid-feedback">{formik.errors.username}</div>
                            ) : null}
                            <div className="spacer-20"></div>

                            <h5>Email Address</h5>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter email"
                              {...formik.getFieldProps("email")}
                            />
                            {formik.touched.email && formik.errors.email ? (
                              <div className="invalid-feedback">{formik.errors.email}</div>
                            ) : null}
                            <div className="spacer-20"></div>

                            <h5>
                              <i className="fa fa-twitter"></i> Twitter username
                            </h5>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Twitter username"
                              {...formik.getFieldProps("twitter")}
                            />

                            <div className="spacer-20"></div>

                            <h5>
                              <i className="fa fa-facebook"></i> Facebook link
                            </h5>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Facebook link"
                              {...formik.getFieldProps("facebook")}
                            />
                          </div>
                        </div>

                        <div id="sidebar" className="col-lg-4">
                          <h5>
                            Profile image{" "}
                            <i
                              className="fa fa-info-circle id-color-2"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Recommend 400 x 400. Max size: 50MB. Click the image to upload."></i>
                          </h5>

                          <label htmlFor="upload_profile_img">
                            <img
                              src={avatar}
                              id="click_profile_img"
                              className="d-profile-img-edit img-fluid rounded-circle"
                              alt=""
                            />
                          </label>
                          <input
                            className="d-none"
                            type="file"
                            id="upload_profile_img"
                            onChange={onAvatarChange}
                          />

                          <div className="spacer-30"></div>

                          <h5>
                            Profile banner{" "}
                            <i
                              className="fa fa-info-circle id-color-2"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Recommend 1500 x 500. Max size: 50MB. Click the image to upload."></i>
                          </h5>
                          <label htmlFor="upload_banner_img">
                            <img
                              src={banner}
                              id="click_banner_img"
                              className="d-banner-img-edit img-fluid rounded"
                              alt=""
                            />
                          </label>

                          <input
                            className="d-none"
                            type="file"
                            id="upload_banner_img"
                            onChange={onBannerChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <input type="submit" className="btn btn-main" value="Update profile" />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
