import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { storeData } from "../../scripts/ipfs";
import { createCollection } from "../../scripts/tokenFactory";

function NewCollectionModal(props) {
  const { reload, setReload } = props;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const thumbnailURI = await storeData(image);
      await createCollection(thumbnailURI, values.name, values.symbol, values.baseURI);
      setLoading(false);
      setReload(!reload);
    }
  });

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0]);
  };

  return (
    <div className="modal fade" id="myModal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form className="form-border" onSubmit={formik.handleSubmit}>
            <div className="modal-header">
              <div className="modal-title">New Collection</div>
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
              {loading ? <div>Loading...</div> : <div>Done!</div>}
            </div>
            <div className="modal-footer">
              <a className="btn-main inline white" data-bs-dismiss="modal" disabled={loading}>
                Close
              </a>
              <input type="submit" className="btn-main" value="Create" disabled={loading}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewCollectionModal;
