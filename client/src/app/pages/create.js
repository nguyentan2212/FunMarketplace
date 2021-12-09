import React, { useState, useContext } from "react";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import ChooseCollection from "../components/ChooseCollection";
import { storeNft } from "../../scripts/ipfs";
import { sell, getAllOrders } from "../../scripts/exchange";
import { mintAndTransfer } from "../../scripts/tokenFactory";
import NewCollectionModal from "../components/NewCollectionModal";
import { AppContext } from "../../scripts/contexts/AppProvider";

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

function Create() {
  const {user} = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(null);
  const [price, setPrice] = useState(null);
  const [royalties, setRoyalties] = useState(null);
  const [collection, setCollection] = useState(null);
  const [reload, setReload] = useState(false);

  const CreateSchema = Yup.object().shape({
    image: Yup.mixed().required("Required"),
    title: Yup.string().required("Required"),
    description: Yup.string(),
    price: Yup.number().required("Required").moreThan(0, "Must more than 0"),
    royalties: Yup.number().required("Required").min(0, "Min is 0").max(40, "Max is 40")
  });

  const formik = useFormik({
    initialValues: {
      image: null,
      title: "",
      description: "",
      price: "",
      royalties: ""
    },
    validationSchema: CreateSchema,
    onSubmit: async (values) => {
      var uri = null;
      var tokenId = 0;
      // store nft on ipfs
      await Swal.fire({
        title: "Upload to IPFS",
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          uri = await storeNft(values.image, values.title, values.description);
          Swal.close();
        }
      });

      await Swal.fire({
        title: "Mint NFT",
        didOpen: async () => {
          Swal.showLoading();
          tokenId = await mintAndTransfer(collection, values.royalties, uri);
          Swal.close();
        }
      });

      await Swal.fire({
        title: "Place order",
        didOpen: async () => {
          Swal.showLoading();
          await sell(collection, tokenId, values.price);
          Swal.close();
        }
      });

      await Swal.fire({
        icon: "success",
        title: "Place order success"
      });
    }
  });

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0]);
  };

  const onPriceChange = (e) => {
    formik.setFieldValue("price", e.target.value);
    setPrice(e.target.value);
  };
  const onRoyaltiesChange = (e) => {
    formik.setFieldValue("royalties", e.target.value);
    setRoyalties(e.target.value);
  };

  const onTitleChange = (e) => {
    formik.setFieldValue("title", e.target.value);
    setTitle(e.target.value);
  };

  return (
    <div>
      <GlobalStyles />
      <NewCollectionModal reload={reload} setReload={setReload} />
      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}>
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Create</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" onSubmit={formik.handleSubmit}>
              <div className="field-set">
                <h5>Upload file</h5>

                <div className="d-create-file">
                  <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                  {image && <p id="file_name">{image.name}</p>}
                  <div className="browse">
                    <input type="button" id="get_file" className="btn-main" value="Browse" />
                    <input id="upload_file" type="file" multiple onChange={onImageChange} />
                  </div>
                </div>
                {formik.touched.image && formik.errors.image ? (
                  <div className="invalid-feedback">{formik.errors.image}</div>
                ) : null}
                <div className="spacer-single"></div>

                <h5>Collection</h5>
                <ChooseCollection setCollection={setCollection} reload={reload} />

                <div className="spacer-single"></div>

                <h5>Title</h5>
                <input
                  type="text"
                  name="item_title"
                  id="item_title"
                  className="form-control"
                  placeholder="e.g. 'Crypto Funk"
                  onChange={onTitleChange}
                  value={formik.values.title}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="invalid-feedback">{formik.errors.title}</div>
                ) : null}

                <div className="spacer-10"></div>

                <h5>Description</h5>
                <textarea
                  data-autoresize
                  name="item_desc"
                  id="item_desc"
                  className="form-control"
                  placeholder="e.g. 'This is very limited item'"
                  {...formik.getFieldProps("description")}></textarea>

                <div className="spacer-10"></div>

                <h5>Price</h5>
                <input
                  type="number"
                  name="item_price"
                  id="item_price"
                  className="form-control"
                  placeholder="enter price for one item (ETH)"
                  onChange={onPriceChange}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price ? (
                  <div className="invalid-feedback">{formik.errors.price}</div>
                ) : null}
                <div className="spacer-10"></div>

                <h5>Royalties</h5>
                <input
                  type="number"
                  name="item_royalties"
                  id="item_royalties"
                  className="form-control"
                  placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 40%"
                  onChange={onRoyaltiesChange}
                  value={formik.values.royalties}
                />
                {formik.touched.royalties && formik.errors.royalties ? (
                  <div className="invalid-feedback">{formik.errors.royalties}</div>
                ) : null}
                <div className="spacer-10"></div>
                <input type="submit" className="btn-main" value="Create Item" />
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5>Preview item</h5>
            <div className="nft__item m-0">
              <div className="author_list_pp">
                <span>
                  <img className="lazy" src={user.thumbnail ? user.thumbnail :"./img/author/author-1.jpg"} alt="" />
                  <i className="fa fa-check"></i>
                </span>
              </div>
              <div className="nft__item_wrap">
                {image ? (
                  <span>
                    <img
                      src={URL.createObjectURL(image)}
                      id="get_file_2"
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </span>
                ) : (
                  <span className="d-create-file" style={{ minHeight: "200px" }}>
                    <p>Upload file to preview your brand new NFT</p>
                  </span>
                )}
              </div>
              <div className="nft__item_info">
                <span>{title ? <h4>{title}</h4> : <h4>Title</h4>}</span>
                <div className="nft__item_price">{price ? price : 0} ETH</div>
                <div className="nft__item_price">{royalties ? royalties : 0} %</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Create;
