import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

export const ModalActions = ({ show, handleClose, getPosts, isEdit, post }) => {
  // Definir el estado inicial fuera de la función
  const initialState = {
    title: "",
    description: "",
    imgUrl: ""
  };

  const [formulario, setFormulario] = useState(initialState); // Usar initialState aquí

  useEffect(() => {
    if (isEdit && post) {
      setFormulario(post); // Rellenar el formulario con los datos del post si es edición
    } else {
      setFormulario(initialState); // Resetear el formulario a su estado inicial si no es edición
    }
  }, [isEdit, post]);

  const closeButtonRef = useRef(null); // Referencia a un botón fuera del modal

  useEffect(() => {
    if (!show && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current.focus(), 0); // Mueve el foco fuera del modal cuando se cierra
    }
  }, [show]);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const savePost = async () => {
    try {
      const { data } = await axios.post("http://localhost:8080/posts", formulario);
      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 1500
      });
      await getPosts();
      resetFormulario();
      handleClose();
    } catch (error) {
      console.log("Error en savePost", error.message);
    }
  };
  const updatePost = async () => {
    try {
      const { data } = await axios.put(`http://localhost:8080/posts/${post.id}`, formulario); // Cambié las comillas simples por backticks
      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 1500
      });
      await getPosts();
      resetFormulario();
      handleClose();
    } catch (error) {
      console.log("Error en updatePost", error.message);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        isEdit? await updatePost(): await savePost();
      if (isEdit) {
        await updatePost();
      } else {
        await savePost();
      }
    } catch (error) {
      console.log("Error en handleSubmit", error.message);
    }
  };

  const resetFormulario = () => {
    setFormulario(initialState);
  };

  return (
    <>
      <button ref={closeButtonRef} style={{ display: "none" }}>Hidden Focus</button> {/* Elemento fuera del modal */}

      <Modal 
        show={show} 
        onHide={handleClose} 
        autoFocus={false}
        backdrop="static" 
        keyboard={false} 
        dialogClassName={show ? "" : "inert-modal"}  // Aplica la clase inert
        aria-hidden={!show}  // Añade aria-hidden para cuando el modal no esté visible
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Editar post" : "Crear post"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formulario.title}
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                rows={4}
                className="form-control"
                name="description"
                value={formulario.description}
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">URL de la Imagen</label>
              <input
                type="text"
                className="form-control"
                name="imgUrl"
                value={formulario.imgUrl}
                required
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {isEdit ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

// Definición de PropTypes
ModalActions.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  post: PropTypes.object // Si es edición, el post será un objeto
};
