import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { storeData } from "../../scripts/ipfs";
import { createCollection } from "../../scripts/tokenFactory";

function NewCollectionModal(props) {
  const { reload, setReload } = props;
  const [image, setImage] = useState(null);

  const CreateSchema = Yup.object().shape({
    image: Yup.mixed().required("Required"),
    name: Yup.string().required("Required"),
    symbol: Yup.string().required("Required"),
    baseURI: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      image: null,
      name: "",
      symbol: ""
    },
    validationSchema: CreateSchema,
    onSubmit: async (values) => {
      var thumbnailURI = null;

      await Swal.fire({
        title: "Upload thumbnail to IPFS",
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          thumbnailURI = await storeData(image);
          Swal.close();
        }
      });

      await Swal.fire({
        title: "Create collection",
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          await createCollection(thumbnailURI, values.name, values.symbol);
          Swal.close();
        }
      });

      await Swal.fire({
        icon: "success",
        title: "Created success"
      });

      setReload(!reload);
    }
  });

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0]);
  };

  return (
    <div className="modal fade" id="newCollectionModal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form className="form-border" onSubmit={formik.handleSubmit}>
            <div className="modal-header">
              <h4 className="modal-title mx-auto">New Collection</h4>
            </div>
            <div className="modal-body">
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
                <div className="spacer-5"></div>

                <h5>Name</h5>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter the collection's name"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                ) : null}
                <div className="spacer-5"></div>

                <h5>Symbol</h5>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter the collection's symbol"
                  {...formik.getFieldProps("symbol")}
                />
                {formik.touched.symbol && formik.errors.symbol ? (
                  <div className="invalid-feedback">{formik.errors.symbol}</div>
                ) : null}
              </div>
            </div>
            <div className="modal-footer">
              <a className="btn-main inline white" data-bs-dismiss="modal" onClick={formik.resetForm}>
                Close
              </a>
              <input type="submit" className="btn-main" value="Create" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewCollectionModal;
